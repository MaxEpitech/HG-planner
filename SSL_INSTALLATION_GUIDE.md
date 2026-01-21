# Guide d'Installation SSL/TLS pour HG-Europe avec PM2

Ce guide vous explique comment configurer votre certificat SSL pour l'application HG-Europe gérée par PM2.

## Prérequis

- Certificat SSL valide (fichiers `.key`, `.crt`, et éventuellement `.ca-bundle`)
- PM2 installé globalement (`npm install -g pm2`)
- Application Next.js déjà buildée (`npm run build`)

## Option 1 : SSL dans Node.js (Recommandé)

Cette option configure HTTPS directement dans votre serveur Node.js.

### Étape 1 : Placer vos certificats SSL

Créez un dossier pour stocker vos certificats de manière sécurisée :

```bash
mkdir -p /chemin/securise/ssl
```

Copiez vos fichiers de certificat :
```bash
# Remplacez par vos vrais chemins
cp private.key /chemin/securise/ssl/
cp certificate.crt /chemin/securise/ssl/
cp ca_bundle.crt /chemin/securise/ssl/  # Si vous en avez un
```

**Sécurisez les permissions :**
```bash
chmod 600 /chemin/securise/ssl/private.key
chmod 644 /chemin/securise/ssl/certificate.crt
chmod 644 /chemin/securise/ssl/ca_bundle.crt
```

### Étape 2 : Configurer les variables d'environnement

Copiez `.env.ssl.example` vers `.env.local` et modifiez les chemins :

```bash
cp .env.ssl.example .env.local
```

Éditez `.env.local` :
```env
NODE_ENV=production
HTTPS_PORT=3443
HTTP_PORT=3000

# Chemins vers vos certificats SSL (REMPLACEZ AVEC VOS VRAIS CHEMINS)
SSL_KEY_PATH=/chemin/securise/ssl/private.key
SSL_CERT_PATH=/chemin/securise/ssl/certificate.crt
SSL_CA_PATH=/chemin/securise/ssl/ca_bundle.crt
```

### Étape 3 : Utiliser le serveur HTTPS

Vous avez deux options :

#### Option A : Remplacer le serveur actuel
```bash
# Sauvegarde de l'ancien serveur
cp server.js server.http.js

# Utiliser le serveur HTTPS
cp server.https.js server.js

# Redémarrer avec PM2
pm2 restart ecosystem.config.js
```

#### Option B : Utiliser une configuration séparée
```bash
# Arrêter l'instance actuelle
pm2 stop hg-europe
pm2 delete hg-europe

# Démarrer avec la nouvelle config
pm2 start ecosystem.https.config.js
```

### Étape 4 : Vérifier le déploiement

```bash
# Voir les logs
pm2 logs hg-europe

# Vérifier le statut
pm2 status

# Sauvegarder la configuration PM2
pm2 save
```

### Étape 5 : Tester HTTPS

Ouvrez votre navigateur :
- HTTPS : `https://votre-domaine.com:3443`
- HTTP (devrait rediriger) : `http://votre-domaine.com:3000`

---

## Option 2 : Reverse Proxy (Nginx/Apache)

Si vous préférez utiliser un reverse proxy (recommandé pour la production), votre application Next.js reste en HTTP et le proxy gère SSL.

### Configuration Nginx

Vous avez déjà un exemple dans `nginx.conf.example`. Modifiez-le pour ajouter SSL :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Rediriger HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    # Configuration SSL
    ssl_certificate /chemin/vers/certificate.crt;
    ssl_certificate_key /chemin/vers/private.key;
    ssl_trusted_certificate /chemin/vers/ca_bundle.crt;

    # Paramètres SSL recommandés
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Proxy vers votre application Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Commandes Nginx :**
```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### Configuration Apache

Vous avez déjà un exemple dans `apache2.conf.example`. Ajoutez SSL :

```apache
<VirtualHost *:80>
    ServerName votre-domaine.com
    Redirect permanent / https://votre-domaine.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName votre-domaine.com

    # Configuration SSL
    SSLEngine on
    SSLCertificateFile /chemin/vers/certificate.crt
    SSLCertificateKeyFile /chemin/vers/private.key
    SSLCertificateChainFile /chemin/vers/ca_bundle.crt

    # Paramètres SSL recommandés
    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on

    # Proxy vers Next.js
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

**Commandes Apache :**
```bash
# Activer les modules nécessaires
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http

# Tester la configuration
sudo apachectl configtest

# Redémarrer Apache
sudo systemctl restart apache2
```

---

## Dépannage

### Erreur : Cannot find module 'https'
Assurez-vous que Node.js est correctement installé. Le module `https` est natif.

### Erreur : ENOENT - No such file
Vérifiez que les chemins vers vos certificats dans `.env.local` sont corrects.

### Erreur : EACCES - Permission denied
```bash
# Vérifiez les permissions
ls -la /chemin/vers/vos/certificats/

# Ajustez si nécessaire
chmod 600 /chemin/vers/private.key
```

### Port déjà utilisé
```bash
# Vérifier quel processus utilise le port
netstat -tuln | grep 3443

# Ou avec lsof (Linux/Mac)
lsof -i :3443
```

### Certificat expiré ou invalide
```bash
# Vérifier la validité du certificat
openssl x509 -in certificate.crt -text -noout
```

---

## Sécurité - Bonnes Pratiques

1. **Ne jamais commiter les certificats SSL** - Ajoutez-les au `.gitignore`
2. **Utiliser des permissions restrictives** sur les fichiers `.key`
3. **Renouveler les certificats** avant expiration
4. **Activer HSTS** pour forcer HTTPS
5. **Tester avec SSL Labs** : https://www.ssllabs.com/ssltest/

---

## Commandes PM2 Utiles

```bash
# Voir les logs en temps réel
pm2 logs hg-europe --lines 100

# Redémarrer après modification
pm2 restart hg-europe

# Recharger sans downtime (mode cluster uniquement)
pm2 reload hg-europe

# Voir les informations détaillées
pm2 show hg-europe

# Monitoring
pm2 monit

# Sauvegarder la config pour redémarrage auto
pm2 save
pm2 startup
```
