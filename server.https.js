// Point d'entrée pour le serveur de production avec HTTPS
// Ce fichier démarre l'application Next.js en mode production avec SSL

const { createServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('Using system environment variables (Plesk)');
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const httpsPort = parseInt(process.env.HTTPS_PORT || '3443', 10);
const httpPort = parseInt(process.env.HTTP_PORT || '3000', 10);

// Chemins vers vos certificats SSL
// Vous pouvez définir ces chemins dans .env.local ou les modifier directement ici
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || '/chemin/vers/votre/private.key';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || '/chemin/vers/votre/certificate.crt';
const SSL_CA_PATH = process.env.SSL_CA_PATH || '/chemin/vers/votre/ca_bundle.crt'; // Optionnel

// Initialiser Next.js
const app = next({ dev, hostname, port: httpsPort });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Configuration HTTPS
  const httpsOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
  };

  // Ajouter le certificat CA si disponible
  if (fs.existsSync(SSL_CA_PATH)) {
    httpsOptions.ca = fs.readFileSync(SSL_CA_PATH);
  }

  // Créer le serveur HTTPS
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(httpsPort, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}:${httpsPort}`);
  });

  // Optionnel : Serveur HTTP qui redirige vers HTTPS
  createHttpServer((req, res) => {
    const host = req.headers.host.replace(`:${httpPort}`, `:${httpsPort}`);
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  }).listen(httpPort, (err) => {
    if (err) throw err;
    console.log(`> HTTP redirect server on http://${hostname}:${httpPort}`);
  });
});
