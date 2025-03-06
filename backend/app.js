const express = require('express');
const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
const path = require('path');
mongoose.connect('mongodb+srv://lucky:Ll25092002@cluster0.20bpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/api/auth', userRoutes);
  app.use('/api/books', bookRoutes); 

  module.exports = app;