
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Charger les variables d'environnement comme dans seed.ts
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// Configuration
const EXCEL_FILE_PATH = "athletes_data.xlsx";

// Initialisation Prisma avec Adapter (comme dans seed.ts)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL manquant dans l'environnement");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Types pour le mapping Excel
interface AthleteRow {
    FirstName: string;
    LastName: string;
    Email?: string;
    Gender?: "M" | "F";
    Category?: string;
    Club?: string;
    [key: string]: string | undefined; // Allow dynamic event columns
}

// Liste des épreuves supportées
const KNOWN_EVENTS = [
    "Pierre légere",
    "Pierre lourde",
    "Poids en longueur léger (6kg)",
    "Poids en longueur lourd (12.7kg)",
    "Poids en longueur léger (12.7kg)",
    "Poids en longueur lourd (19.09kg)",
    "Poids en longueur lourd (25.4kg)",
    "Poids en hauteur (19.09kg)",
    "Poids en hauteur (25.4kg)",
    "Poids en hauteur (12.7kg)",
    "Marteau leger (7.26kg)",
    "Marteau lourd (10kg)",
    "Marteau lourd (7.26kg)",
    "Marteau leger (5kg)",
    "Retourné de tronc",
    "Lancer de gerbe"
];

async function main() {
    console.log("🚀 Lancement du script d'importation...");

    const filePath = path.join(process.cwd(), EXCEL_FILE_PATH);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier non trouvé : ${filePath}`);
        console.log(`👉 Veuillez placer votre fichier Excel à la racine du projet nommé '${EXCEL_FILE_PATH}'.`);
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
            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    firstName: row.FirstName,
                    lastName: row.LastName,
                    role: "ATHLETE",
                    passwordHash: "$2a$12$eXampleHashPlaceHolder",
                    isApproved: true,
                },
            });

            // 2. Créer ou mettre à jour le Profil Athlète
            const athlete = await prisma.athlete.upsert({
                where: { userId: user.id },
                update: {
                    club: row.Club,
                    gender: row.Gender,
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
            for (const [key, value] of Object.entries(row)) {
                const eventName = KNOWN_EVENTS.find(e => e.toLowerCase() === key.trim().toLowerCase());

                if (eventName && value) {
                    await prisma.personalRecord.create({
                        data: {
                            athleteId: athlete.id,
                            eventName: eventName,
                            performance: String(value),
                            date: new Date(),
                            notes: "Import Excel",
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
