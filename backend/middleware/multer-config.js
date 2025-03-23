const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Extraire le nom de base sans l'extension
    const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
    // Remplacer les espaces par des underscores
    const name = nameWithoutExt.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

// Middleware d'optimisation d'image
module.exports = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: "Erreur lors du téléchargement de l'image" });
    }
    
    if (!req.file) {
      return next();
    }
    
    const filePath = req.file.path;
    
    let sharpImage = sharp(filePath)
      .resize({
        width: 463,
        height: 595,
        fit: sharp.fit.cover,
        position: 'center',
      });
    
    if (req.file.mimetype === 'image/png') {
      sharpImage = sharpImage.png({ quality: 80 });
    } else {
      sharpImage = sharpImage.jpeg({ quality: 80 });
    }
    
    sharpImage.toBuffer()
      .then(buffer => fs.writeFile(filePath, buffer))
      .then(() => next())
      .catch(error => res.status(500).json({ error }));
  });
};