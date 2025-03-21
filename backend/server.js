// Importation des modules nécessaires
const http = require('http');  // Module HTTP natif de Node.js
const app = require('./app');  // Application Express configurée

// Fonction pour s'assurer que le port est un nombre valide
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

// Configuration du port: utilise la variable d'environnement ou 3000 par défaut
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestionnaire d'erreurs du serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') throw error;
  
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  
  // Gestion des erreurs courantes de démarrage
  switch (error.code) {
    case 'EACCES': // Erreur de permissions insuffisantes
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': // Erreur de port déjà utilisé
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP avec Express
const server = http.createServer(app);

// Attachement des gestionnaires d'événements
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Message de confirmation
});

// Démarrage du serveur sur le port configuré
server.listen(port);