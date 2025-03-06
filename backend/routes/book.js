const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book');

router.get('/books', bookCtrl.ToutLesLivres); //Renvoie tableau de tout les livres de la DB//
router.get('/books/bestrating', bookCtrl.MeilleurNotes); //Renvoie un tableau des 3 livres avec la meilleur notes moyennes//
router.get('/books/:id', bookCtrl.LivreById); //Renvoie un livre avec l'id//


router.post('/', auth, multer, bookCtrl.NouveauLivre); //Crée un nouveau livre et enregistre l'image dans DB et crée un URL//

module.exports = router;
