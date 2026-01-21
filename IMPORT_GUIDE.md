
# Guide d'Import de Données

Ce script permet d'importer massivement des athlètes et leurs records depuis un fichier Excel.

## 1. Préparer le fichier Excel

Créez un fichier nommé `athletes_data.xlsx` à la racine du projet avec les colonnes suivantes (respectez la casse, la première ligne doit contenir ces titres) :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `FirstName` | Prénom (Requis) | Jean |
| `LastName` | Nom (Requis) | Dupont |
| `Email` | Email (Optionnel*) | jean.dupont@email.com |
| `Gender` | Genre | M ou F |
| `Club` | Club | Highland Club Paris |
| `Category` | Catégorie | Open A |
| `Pierre` | Perf. Stone Put | 10.50m |
| `PoidsLongueur` | Perf. Poids Longueur | 15.20m |
| `PoidsHauteur` | Perf. Poids Hauteur | 4.50m |
| `Marteau` | Perf. Marteau | 25.00m |
| `Caber` | Perf. Caber Toss | 12:00 |

*\*Si l'email est manquant, une adresse temporaire sera générée (prenom.nom@import.temp).*

## 2. Lancer le script

Exécutez la commande suivante dans votre terminal :

```bash
npx tsx scripts/import-athletes.ts
```

Le script va :
1. Lire le fichier Excel.
2. Créer les comptes utilisateurs correspondants.
3. Créer les profils athlètes.
4. Insérer les records personnels associés.

## 4. Import des Records Officiels (Europe/National)

Pour importer les records officiels (à afficher dans les comparatifs ou s   ur une page dédiée), créez un fichier `official_records.xlsx` :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `Event` | Nom de l'épreuve | Pierre |
| `Category` | Catégorie (Ex: Homme, Femme, Lightweight Homme, Masters Femme) | Open A |
| `Scope` | Portée (Pays/Continent) | France, Europe, Suisse, Allemagne... |
| `Performance` | Performance | 13.50m |
| `Athlete` | Détenteur du record | Scott Rider |
| `Date` | Date du record | 2023-06-15 |
| `Location` | Lieu | Bressuire |

Lancer l'import :
```bash
npx tsx scripts/import-official-records.ts
```
