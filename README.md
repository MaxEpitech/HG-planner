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

## Prochaines étapes

1. ✅ Brancher NextAuth (credentials) + sécuriser les layouts admin
2. Construire les API routes / server actions pour créer compétitions & groupes
3. Ouvrir le portail public d’inscription et relier les validations côté admin
4. Implémenter la saisie de résultats et le calcul automatique des points
