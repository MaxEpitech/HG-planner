# Guide de déploiement sur Plesk

Plesk gère Apache automatiquement et peut écraser les configurations manuelles. Il faut donc configurer l'application directement dans l'interface Plesk.

## Prérequis

1. Accès à l'interface Plesk
2. Node.js installé sur le serveur (vérifier dans Plesk : **Tools & Settings > Server Components**)
3. Un domaine/sous-domaine configuré dans Plesk

## Configuration dans Plesk

### Étape 1 : Créer un domaine/sous-domaine

1. Connectez-vous à Plesk
2. Allez dans **Websites & Domains**
3. Cliquez sur **Add Domain** ou utilisez un domaine existant
4. Configurez le domaine (ex: `hg-europe.votre-domaine.com`)

### Étape 2 : Activer Node.js dans Plesk

1. Dans **Websites & Domains**, sélectionnez votre domaine
2. Allez dans **Node.js**
3. Si Node.js n'est pas activé, cliquez sur **Enable Node.js**
4. Configurez :
   - **Node.js version** : Sélectionnez la version 20.x ou supérieure
   - **Application mode** : `production`
   - **Application root** : `/var/www/vhosts/votre-domaine.com/httpdocs` (ou le chemin de votre application)
   - **Application startup file** : `server.js`
   - **Application URL** : `/` (ou laissez vide pour la racine)

### Étape 3 : Configurer les variables d'environnement

1. Dans la section **Node.js**, allez dans **Environment Variables**
2. Ajoutez les variables suivantes :
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/hg_inscriptions?schema=public
   NEXTAUTH_SECRET=votre-secret-ici
   NEXTAUTH_URL=https://votre-domaine.com
   ```

### Étape 4 : Déployer le code

**Option A : Via Git (Recommandé)**

1. Dans Plesk, allez dans **Git**
2. Cliquez sur **Add Repository**
3. Configurez :
   - **Repository URL** : `git@github.com:MaxEpitech/HG-planner.git`
   - **Branch** : `main`
   - **Deployment path** : Le chemin où vous voulez déployer (ex: `/var/www/vhosts/votre-domaine.com/httpdocs`)
   - **Update command** : 
     ```bash
     npm ci --production=false && npm run build && npm run prisma:generate
     ```
   - **Deployment trigger** : Configurez selon vos besoins

**Option B : Via FTP/SFTP**

1. Utilisez un client FTP (FileZilla, WinSCP, etc.)
2. Connectez-vous au serveur
3. Uploadez tous les fichiers dans le répertoire du domaine
4. Exécutez les commandes via SSH :
   ```bash
   cd /var/www/vhosts/votre-domaine.com/httpdocs
   npm install
   npm run build
   npm run prisma:generate
   ```

### Étape 5 : Configurer la base de données

1. Dans Plesk, allez dans **Databases**
2. Créez une base de données PostgreSQL (ou utilisez une existante)
3. Notez les informations de connexion
4. Mettez à jour `DATABASE_URL` dans les variables d'environnement
5. Exécutez les migrations :
   ```bash
   npm run db:push
   ```

### Étape 6 : Démarrer l'application

1. Dans la section **Node.js** de Plesk
2. Cliquez sur **Restart App** ou **Start App**
3. Vérifiez les logs dans **Logs** pour voir si l'application démarre correctement

## Configuration Apache dans Plesk

Si Plesk ne configure pas automatiquement le reverse proxy, vous pouvez le faire manuellement :

1. Dans Plesk, allez dans **Websites & Domains** > votre domaine
2. Cliquez sur **Apache & nginx Settings**
3. Dans **Additional directives for Apache**, ajoutez :

```apache
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
</IfModule>
```

4. Cliquez sur **OK** pour sauvegarder

## Vérification

1. Accédez à votre URL : `https://votre-domaine.com`
2. Vérifiez les logs dans Plesk : **Logs** > **Error Log** et **Access Log**
3. Vérifiez les logs Node.js dans la section **Node.js** > **Logs**

## Commandes utiles via SSH

Si vous avez accès SSH :

```bash
# Aller dans le répertoire de l'application
cd /var/www/vhosts/votre-domaine.com/httpdocs

# Vérifier que l'application tourne
ps aux | grep node

# Voir les logs
tail -f /var/www/vhosts/votre-domaine.com/httpdocs/logs/pm2-out.log

# Redémarrer l'application (si vous utilisez PM2)
pm2 restart hg-europe
```

## Dépannage

### L'application ne démarre pas

1. Vérifiez les logs dans Plesk : **Node.js** > **Logs**
2. Vérifiez que le port 3000 n'est pas déjà utilisé
3. Vérifiez les variables d'environnement
4. Vérifiez que `server.js` existe et est exécutable

### Erreur "Cannot find module"

1. Vérifiez que `node_modules` est présent
2. Exécutez `npm install` dans le répertoire de l'application
3. Vérifiez que `prisma generate` a été exécuté

### Erreur de connexion à la base de données

1. Vérifiez `DATABASE_URL` dans les variables d'environnement
2. Vérifiez que PostgreSQL est accessible depuis le serveur
3. Vérifiez les permissions de la base de données

### L'URL ne fonctionne pas

1. Vérifiez que le reverse proxy est configuré dans Apache
2. Vérifiez que Node.js est activé et démarré dans Plesk
3. Vérifiez les logs Apache dans Plesk

## Mise à jour de l'application

**Via Git dans Plesk :**
1. Allez dans **Git**
2. Cliquez sur **Update** à côté de votre dépôt
3. Plesk exécutera automatiquement la commande de déploiement

**Via SSH :**
```bash
cd /var/www/vhosts/votre-domaine.com/httpdocs
git pull origin main
npm install
npm run build
npm run prisma:generate
# Redémarrer l'application dans Plesk
```

## Notes importantes

- ⚠️ **Ne modifiez pas directement les fichiers Apache** dans `/etc/apache2/` car Plesk les écrasera
- ✅ **Utilisez toujours l'interface Plesk** pour configurer Apache
- ✅ **Les variables d'environnement** doivent être définies dans Plesk, pas dans `.env.local`
- ✅ **Le fichier `.env.local`** peut ne pas être lu par Plesk, utilisez les variables d'environnement de Plesk



