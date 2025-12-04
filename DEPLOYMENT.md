# Guide de déploiement - Lancer l'application en arrière-plan

## Option 1 : PM2 (Recommandé) ⭐

PM2 est un gestionnaire de processus pour Node.js qui permet de lancer, surveiller et redémarrer automatiquement votre application.

### Installation
```bash
npm install -g pm2
```

### Lancer l'application
```bash
# Méthode 1 : Avec le fichier de configuration
pm2 start ecosystem.config.js

# Méthode 2 : Directement avec la commande
pm2 start server.js --name hg-europe

# Méthode 3 : Avec npm script
pm2 start npm --name hg-europe -- run start:server
```

### Commandes utiles PM2
```bash
# Voir les processus en cours
pm2 list

# Voir les logs en temps réel
pm2 logs hg-europe

# Voir les logs des 100 dernières lignes
pm2 logs hg-europe --lines 100

# Redémarrer l'application
pm2 restart hg-europe

# Arrêter l'application
pm2 stop hg-europe

# Supprimer l'application de PM2
pm2 delete hg-europe

# Surveiller les ressources (CPU, mémoire)
pm2 monit

# Sauvegarder la configuration actuelle
pm2 save

# Configurer le démarrage automatique au boot
pm2 startup
# Suivez les instructions affichées
```

### Configuration du démarrage automatique
```bash
# Sauvegarder la configuration
pm2 save

# Configurer pour démarrer au boot
pm2 startup
# Exécutez la commande qui s'affiche (généralement quelque chose comme):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u votre-utilisateur --hp /home/votre-utilisateur
```

---

## Option 2 : systemd (Service Linux)

Crée un service système qui démarre automatiquement au boot.

### Configuration
```bash
# Copier le fichier de service
sudo cp hg-europe.service.example /etc/systemd/system/hg-europe.service

# Éditer le fichier pour ajuster les chemins
sudo nano /etc/systemd/system/hg-europe.service
```

### Commandes systemd
```bash
# Recharger la configuration
sudo systemctl daemon-reload

# Démarrer le service
sudo systemctl start hg-europe

# Arrêter le service
sudo systemctl stop hg-europe

# Redémarrer le service
sudo systemctl restart hg-europe

# Voir le statut
sudo systemctl status hg-europe

# Activer le démarrage automatique au boot
sudo systemctl enable hg-europe

# Désactiver le démarrage automatique
sudo systemctl disable hg-europe

# Voir les logs
sudo journalctl -u hg-europe -f
```

---

## Option 3 : nohup (Simple mais basique)

Lance l'application en arrière-plan et continue même si la session SSH se ferme.

```bash
# Lancer avec nohup
nohup node server.js > app.log 2>&1 &

# Ou avec npm
nohup npm run start:server > app.log 2>&1 &

# Voir le PID du processus
echo $!

# Arrêter l'application (remplacer PID par le numéro du processus)
kill PID

# Ou trouver et tuer le processus
pkill -f "node server.js"
```

**Inconvénients :**
- Pas de redémarrage automatique en cas de crash
- Pas de surveillance des ressources
- Plus difficile à gérer

---

## Option 4 : screen ou tmux (Session persistante)

Permet de garder une session terminale active même après déconnexion.

### Avec screen
```bash
# Installer screen (si nécessaire)
sudo apt install screen

# Créer une nouvelle session
screen -S hg-europe

# Dans la session, lancer l'application
node server.js
# ou
npm run start:server

# Détacher la session : Ctrl+A puis D

# Reconnecter à la session
screen -r hg-europe

# Lister les sessions
screen -ls

# Tuer une session
screen -X -S hg-europe quit
```

### Avec tmux
```bash
# Installer tmux (si nécessaire)
sudo apt install tmux

# Créer une nouvelle session
tmux new -s hg-europe

# Dans la session, lancer l'application
node server.js
# ou
npm run start:server

# Détacher la session : Ctrl+B puis D

# Reconnecter à la session
tmux attach -t hg-europe

# Lister les sessions
tmux ls

# Tuer une session
tmux kill-session -t hg-europe
```

---

## Comparaison des méthodes

| Méthode | Redémarrage auto | Surveillance | Démarrage au boot | Complexité |
|---------|------------------|--------------|-------------------|------------|
| **PM2** | ✅ Oui | ✅ Oui | ✅ Oui | ⭐⭐ Facile |
| **systemd** | ✅ Oui | ✅ Oui | ✅ Oui | ⭐⭐⭐ Moyen |
| **nohup** | ❌ Non | ❌ Non | ❌ Non | ⭐ Très facile |
| **screen/tmux** | ❌ Non | ❌ Non | ❌ Non | ⭐⭐ Facile |

## Recommandation

**Utilisez PM2** pour la production car il offre :
- ✅ Redémarrage automatique en cas de crash
- ✅ Surveillance des ressources (CPU, mémoire)
- ✅ Gestion des logs
- ✅ Démarrage automatique au boot
- ✅ Interface simple et intuitive
- ✅ Support du clustering (plusieurs instances)

## Exemple complet avec PM2

```bash
# 1. Installer PM2
npm install -g pm2

# 2. Lancer l'application
pm2 start ecosystem.config.js

# 3. Vérifier que ça fonctionne
pm2 list
pm2 logs hg-europe

# 4. Sauvegarder et configurer le démarrage au boot
pm2 save
pm2 startup
# Suivez les instructions affichées

# 5. Votre application est maintenant lancée en arrière-plan !
```



