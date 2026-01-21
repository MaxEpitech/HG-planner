
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
const EXCEL_FILE_PATH = "athletes_data.xlsx"; // Nom du fichier attendu à la racine

// Initialisation Prisma
const prisma = new PrismaClient();

// Types pour le mapping Excel
interface AthleteRow {
    FirstName: string;
    LastName: string;
    Email?: string;
    Gender?: "M" | "F";
    Category?: string;
    Club?: string;
    // Events (Performances en string ex: "10.50m")
    Pierre?: string; // Stone Put
    PoidsLongueur?: string; // Weight for Distance
    PoidsHauteur?: string; // Weight for Height
    Marteau?: string; // Hammer
    Caber?: string; // Caber Toss
}

async function main() {
    console.log("🚀 Lancement du script d'importation...");

    const filePath = path.join(process.cwd(), EXCEL_FILE_PATH);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier non trouvé : ${filePath}`);
        console.log("👉 Veuillez placer votre fichier Excel à la racine du projet nommé 'athletes_data.xlsx'.");
        process.exit(1);
    }

    // Lecture du fichier Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Conversion en JSON
    const data: AthleteRow[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 ${data.length} lignes trouvées dans le fichier.`);

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const row of data) {
        try {
            if (!row.FirstName || !row.LastName) {
                console.warn("⚠️ Ligne ignorée (Nom/Prénom manquant)", row);
                continue;
            }

            const email = row.Email || `${row.FirstName.toLowerCase()}.${row.LastName.toLowerCase()}@import.temp`;

            console.log(`👤 Traitement : ${row.FirstName} ${row.LastName}`);

            // 1. Créer ou récupérer le User
            // On utilise un email généré si pas fourni pour pouvoir créer le compte
            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    firstName: row.FirstName,
                    lastName: row.LastName,
                    role: "ATHLETE",
                    passwordHash: "$2a$12$eXampleHashPlaceHolder", // Mot de passe dummy, à reset
                    isApproved: true,
                },
            });

            // 2. Créer ou mettre à jour le Profil Athlète
            const athlete = await prisma.athlete.upsert({
                where: { userId: user.id },
                update: {
                    club: row.Club,
                    gender: row.Gender,
                    // On ne met pas à jour le reste pour ne pas écraser les données existantes importantes
                },
                create: {
                    userId: user.id,
                    firstName: row.FirstName,
                    lastName: row.LastName,
                    email: user.email,
                    club: row.Club,
                    gender: row.Gender,
                },
            });

            // 3. Ajouter les Records Personnels
            const recordsToAdd = [
                { name: "Pierre (Stone Put)", perf: row.Pierre },
                { name: "Poids en Longueur", perf: row.PoidsLongueur },
                { name: "Poids en Hauteur", perf: row.PoidsHauteur },
                { name: "Marteau", perf: row.Marteau },
                { name: "Retourné de Tronc", perf: row.Caber },
            ];

            for (const rec of recordsToAdd) {
                if (rec.perf) {
                    // Vérifier si ce record existe déjà pour éviter les doublons inutiles
                    // Ici on simplifie en ajoutant toujours, ou on pourrait check l'existence
                    // Pour l'import initial, on crée.

                    await prisma.personalRecord.create({
                        data: {
                            athleteId: athlete.id,
                            eventName: rec.name,
                            performance: String(rec.perf),
                            date: new Date(), // Date d'import
                            notes: "Import automatique Excel",
                        },
                    });
                }
            }

            createdCount++;
        } catch (err) {
            console.error(`❌ Erreur pour ${row.FirstName} ${row.LastName}:`, err);
            errorCount++;
        }
    }

    console.log("\n✅ Import terminé !");
    console.log(`- Athlètes traités/créés : ${createdCount}`);
    console.log(`- Erreurs : ${errorCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
