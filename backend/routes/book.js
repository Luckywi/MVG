const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.ToutLesLivres); //Renvoie tableau de tout les livres de la DB//
router.get('/bestrating', bookCtrl.MeilleurNotes); //Renvoie un tableau des 3 livres avec la meilleur notes moyennes//
router.get('/:id', bookCtrl.LivreById); //Renvoie un livre avec l'id//


router.post('/', auth, multer, bookCtrl.NouveauLivre); //Crée un nouveau livre et enregistre l'image dans DB et crée un URL//
router.post('/:id/rating', auth, bookCtrl.AjouterNote); //Ajouter une note, ID de l'user ajouter au tableau ratings et impossible qu'un même ID écris deux avis sur même livre//


router.put('/:id',auth, multer, bookCtrl.ModifierLivre);//Mettre à jour un livre via ID, gérer l'image//

router.delete('/:id', auth, bookCtrl.SupprimerLivre); //Supprimez livre via ID

module.exports = router;
