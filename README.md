## Highland Games – Gestion des inscriptions et résultats

Application Next.js 16 (App Router + Tailwind v4) dédiée aux compétitions de Highland Games (Luzarches et autres organisateurs). Elle couvre :

- Création d’événements, groupes et épreuves par l’organisateur
- Attribution de rôles `Organisateur` et `Directeur Athlétique`
- Inscriptions des athlètes (sans paiement en ligne)
- Saisie des résultats avec système de points inversé (1er = 1 point)

## Stack

- Next.js 16 / React 19
- Tailwind CSS v4
- Prisma + PostgreSQL
- NextAuth (email/password ou providers à définir)
- TypeScript + ESLint

## Démarrage

```bash
cp env.example .env.local   # renseigner DATABASE_URL, NEXTAUTH_SECRET
npm install
npm run db:push             # applique le schéma Prisma sur votre base
npm run dev                 # http://localhost:3000
```

## Commandes utiles

- `npm run prisma:generate` – régénère le client Prisma
- `npm run prisma:studio` – ouvre Prisma Studio pour inspecter les données
- `npm run lint` – vérifie la qualité du code

## Structure actuelle

- `src/app/page.tsx` – landing de présentation et roadmap
- `src/app/admin/*` – gabarits du back-office (tableau de bord, compétitions, athlètes, résultats)
- `prisma/schema.prisma` – modèle de données (users, permissions, compétitions, groupes, épreuves, inscriptions, résultats)
- `src/lib/prisma.ts` – client Prisma partagé
- `src/lib/auth/roles.ts` – utilitaires de rôles/permissions

## Authentification

L'application utilise NextAuth avec authentification par email/mot de passe.

### Créer des utilisateurs de test

```bash
npm run db:seed
```

Cela crée 3 comptes de test :
- `organisateur@test.com` / `admin123` (rôle Organisateur)
- `directeur@test.com` / `admin123` (rôle Directeur Athlétique)
- `admin@test.com` / `admin123` (rôle Admin plateforme)

### Configuration

Assurez-vous que `NEXTAUTH_SECRET` est défini dans `.env.local`. Vous pouvez générer une clé avec :

```bash
openssl rand -base64 32
```

## Déploiement en production

### Prérequis sur le serveur

- Node.js 20.x ou supérieur
- PostgreSQL
- Nginx (optionnel, pour reverse proxy)
- PM2 ou systemd (pour gérer le processus)

### Étapes de déploiement

1. **Cloner le dépôt sur le serveur :**
   ```bash
   git clone git@github.com:MaxEpitech/HG-planner.git
   cd HG-planner
   ```

2. **Configurer les variables d'environnement :**
   ```bash
   cp env.example .env.local
   nano .env.local  # Éditer avec vos valeurs
   ```
   
   Variables importantes :
   - `DATABASE_URL` : URL de connexion PostgreSQL
   - `NEXTAUTH_SECRET` : Clé secrète (générer avec `openssl rand -base64 32`)
   - `NEXTAUTH_URL` : URL publique de votre application (ex: `https://votre-domaine.com`)
   - `PORT` : Port d'écoute (par défaut 3000)

3. **Déployer l'application :**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Démarrer l'application :**

   **Option A - Avec PM2 (recommandé) :**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # Pour démarrer au boot
   ```

   **Option B - Avec systemd :**
   ```bash
   sudo cp hg-europe.service.example /etc/systemd/system/hg-europe.service
   sudo nano /etc/systemd/system/hg-europe.service  # Ajuster les chemins
   sudo systemctl daemon-reload
   sudo systemctl enable hg-europe
   sudo systemctl start hg-europe
   ```

5. **Configurer Nginx (reverse proxy) :**
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/hg-europe
   sudo nano /etc/nginx/sites-available/hg-europe  # Ajuster le domaine
   sudo ln -s /etc/nginx/sites-available/hg-europe /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Configurer SSL avec Let's Encrypt (optionnel mais recommandé) :**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d votre-domaine.com
   ```

### Commandes utiles en production

- **Voir les logs PM2 :** `pm2 logs hg-europe`
- **Redémarrer l'app :** `pm2 restart hg-europe`
- **Voir le statut systemd :** `sudo systemctl status hg-europe`
- **Voir les logs systemd :** `sudo journalctl -u hg-europe -f`

### Mise à jour de l'application

```bash
git pull origin main
./deploy.sh
pm2 restart hg-europe  # ou systemctl restart hg-europe
```

## Prochaines étapes

1. ✅ Brancher NextAuth (credentials) + sécuriser les layouts admin
2. Construire les API routes / server actions pour créer compétitions & groupes
3. Ouvrir le portail public d'inscription et relier les validations côté admin
4. Implémenter la saisie de résultats et le calcul automatique des points
