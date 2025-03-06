const Book = require('../models/book');
const bcrypt = require('bcrypt');

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
  // Parsez l'objet livre depuis la requête
  // Si la requête est envoyée avec form-data (à cause de l'image), req.body.book sera une chaîne
  const bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
  
  // Créez un nouveau livre avec les données envoyées
  const book = new Book({
    ...bookObject,
    // Construisez l'URL de l'image à partir des informations du fichier
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : bookObject.imageUrl,
    // Initialisez les ratings et averageRating
    ratings: [],
    averageRating: 0
  });

  // Sauvegardez le livre dans la base de données
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré avec succès!' }))
    .catch(error => res.status(400).json({ error }));
};

