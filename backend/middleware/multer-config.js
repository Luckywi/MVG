const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

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
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

// Middleware d'optimisation d'image
module.exports = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return next(err);
    }
    
    if (!req.file) {
      return next();
    }
    
    // Chemin du fichier original
    const filePath = req.file.path;
    
    // Optimiser l'image
    sharp(filePath)
      .resize({
        width: 463,
        height: 595,
        fit: sharp.fit.cover,
        position: 'centre',
      }) 
      .jpeg({ quality: 80 }) 
      .toBuffer()
      .then(buffer => {
        // Écraser le fichier original avec la version optimisée
        fs.writeFile(filePath, buffer, (err) => {
          if (err) return next(err);
          next();
        });
      })
      .catch(err => next(err));
  });
};