// Point d'entrée pour le serveur de production
// Ce fichier démarre l'application Next.js en mode production

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Charger les variables d'environnement
// Plesk utilise les variables d'environnement définies dans l'interface
// On essaie d'abord .env.local, puis on utilise les variables système
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // Si .env.local n'existe pas, utiliser les variables d'environnement système (Plesk)
  console.log('Using system environment variables (Plesk)');
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialiser Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

