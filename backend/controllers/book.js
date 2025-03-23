const Book = require('../models/book');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');


exports.ToutLesLivres = (req, res, next) => {
    Book.find() //Trouve tout les livres du tableau
        .then(books => res.status(200).json(books))
        .catch(error => res.status(500).json({error}));
};

exports.LivreById = (req, res, next) => {
    Book.findOne({_id: req.params.id}) //Récupère l'id dans le lien et le donne comme paramètre a findOne//
        .then(book => {
            if (!book){
                return res.status(404).json({message: 'Livre non trouvé !'});
            }
            res.status(200).json(book);
        })
        .catch(error => res.status(500).json({error}));
};

exports.MeilleurNotes = (req, res, next) => {
    Book.find()
    .sort({averageRating: -1}) //Tri tout les livres par ordre décroissant en fonction de leur notes moyenne(1 = liste croissante)//
    .limit(3) //Limite le resultat à 3//
    .then(books => res.status(200).json(books))
    .catch(error => res.status(500).json({error}));
};

exports.NouveauLivre = (req, res, next) => {

  // La requête est forcemment envoyée avec form-data car imageURL est required donc on parse en JSON le corp de la requete 
  const bookObject = JSON.parse(req.body.book);
  
  // Créez un nouveau livre avec les données envoyées
  const book = new Book({
    ...bookObject,
    // On indique précisement ce que doit contennir le champ imageUrl
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  // Sauvegardez le livre dans la base de données
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré avec succès!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.AjouterNote = (req, res, next) => {

    const userId = req.auth.userId;

    Book.findOne({_id: req.params.id})
    .then(book => {
        if (!book) {
            return res.status(404).json({message : 'Livre non trouvé !'});
        }
         const userRated = book.ratings.find(rating => rating.userId === userId)
          if (userRated) {
            return res.status(400).json({message: 'Vous aves déja noté ce livre !'})
          }

          const newRating = {
            userId: userId,
            grade: req.body.rating
          }

          book.ratings.push(newRating);

        const totalRatings = book.ratings.length;
        const sommeRatings = book.ratings.reduce((somme, rating) => somme + rating.grade, 0);
        book.averageRating = totalRatings > 0 ? Math.round((sommeRatings / totalRatings) * 10) / 10 : 0;

        return book.save();
})
        .then(noteAjouter => res.status(200).json(noteAjouter))
        .catch(error => res.status(500).json ({error}));
};

exports.ModifierLivre = (req, res, next) => {
    // On vérifie si une nouvelle image est fournie
    const bookObject = req.file ? {...JSON.parse(req.body.book),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body };
    // Suppression de l'_id envoyé par le client pour éviter les conflits
    delete bookObject._userId;
    
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // Vérification que l'utilisateur est autorisé à modifier
        if (book.userId != req.auth.userId) {
          return res.status(403).json({ message: 'Non autorisé' });
        }
        
      
        const oldImagePath = book.imageUrl.split('/images/')[1];
        
        // Mise à jour avec updateOne
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => {
            // Suppression de l'ancienne image si une nouvelle a été fournie
            if (req.file && oldImagePath) {
              fs.unlink(`images/${oldImagePath}`, (err) => {
                if (err) console.log("Erreur lors de la suppression de l'image:", err);
              });
            }
            res.status(200).json({ message: 'Livre modifié!' });
          })
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(404).json({ error }));
  };


  exports.SupprimerLivre = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé !' });
        }
        
        // Vérification que l'utilisateur est autorisé à supprimer
        if (book.userId !== req.auth.userId) {
          return res.status(403).json({ message: 'Non autorisé' });
        }
        
        // Récupération du nom de fichier de l'image
        const filename = book.imageUrl.split('/images/')[1];
        
        // Suppression de l'image du système de fichiers
        fs.unlink(`images/${filename}`, () => {
          // Puis suppression du document de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };