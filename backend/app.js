// Charge les variables d'environnement du fichier .env
require('dotenv').config();

// Importe les dépendances nécessaires
const express = require('express');  // Framework web
const app = express();  // Crée l'instance de l'application Express
const bookRoutes = require('./routes/book');  // Routes pour les livres
const userRoutes = require('./routes/user');  // Routes pour les utilisateurs
const mongoose = require('mongoose');  // ODM pour MongoDB
const path = require('path');  // Gestion des chemins de fichiers

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour configurer les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    // Autorise les requêtes de toutes les origines
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Autorise certains en-têtes dans les requêtes
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Autorise certaines méthodes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();  // Passe au middleware suivant
});

// Middleware pour servir les fichiers statiques du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement des routes principales
app.use('/api/auth', userRoutes);  // Routes d'authentification
app.use('/api/books', bookRoutes);  // Routes pour les livres

// Exporte l'application pour l'utiliser dans server.js
module.exports = app;