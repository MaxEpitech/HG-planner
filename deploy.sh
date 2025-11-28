#!/bin/bash

# Script de déploiement pour Highland Games
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json introuvable. Êtes-vous dans le bon répertoire?${NC}"
    exit 1
fi

# Vérifier que .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Attention: .env.local n'existe pas. Créez-le à partir de env.example${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Installation des dépendances...${NC}"
npm ci --production=false

echo -e "${GREEN}🔧 Génération du client Prisma...${NC}"
npm run prisma:generate

echo -e "${GREEN}🏗️  Construction de l'application...${NC}"
npm run build

echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo -e "${YELLOW}💡 Pour démarrer l'application:${NC}"
echo -e "   - Avec PM2: pm2 start ecosystem.config.js"
echo -e "   - Directement: npm run start:server"
echo -e "   - Avec systemd: systemctl start hg-europe"

