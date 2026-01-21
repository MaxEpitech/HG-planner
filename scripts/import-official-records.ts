
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Configuration
const EXCEL_FILE_PATH = "official_records.xlsx";

// Initialisation Prisma
const prisma = new PrismaClient();

// Types pour le mapping Excel
interface RecordRow {
    Event: string;      // ex: Pierre, Marteau
    Category: string;   // ex: Open A, Masters
    Scope: string;      // ex: Europe, France
    Performance: string;// ex: 10.50m
    Athlete: string;    // ex: Jean Dupont
    Date?: string | number; // ex: 2024-05-20
    Location?: string;  // ex: Bressuire
}

async function main() {
    console.log("🚀 Lancement de l'import des records officiels...");

    const filePath = path.join(process.cwd(), EXCEL_FILE_PATH);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier non trouvé : ${filePath}`);
        console.log("👉 Veuillez placer votre fichier Excel à la racine du projet nommé 'official_records.xlsx'.");
        process.exit(1);
    }

    // Lecture du fichier Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Conversion en JSON
    const data: RecordRow[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 ${data.length} records trouvés.`);

    let createdCount = 0;

    for (const row of data) {
        try {
            if (!row.Event || !row.Category || !row.Scope || !row.Performance || !row.Athlete) {
                console.warn("⚠️ Ligne incomplète ignorée", row);
                continue;
            }

            // Parsing de la date (Excel date code ou string)
            let recordDate = new Date();
            if (row.Date) {
                if (typeof row.Date === 'number') {
                    const dateObj = XLSX.SSF.parse_date_code(row.Date);
                    recordDate = new Date(dateObj.y, dateObj.m - 1, dateObj.d);
                } else {
                    recordDate = new Date(row.Date);
                }
            }

            console.log(`🏆 Record : ${row.Scope} - ${row.Event} (${row.Category})`);

            await prisma.officialRecord.upsert({
                where: {
                    eventName_category_scope: {
                        eventName: row.Event,
                        category: row.Category,
                        scope: row.Scope,
                    }
                },
                update: {
                    performance: String(row.Performance),
                    athleteName: row.Athlete,
                    date: recordDate,
                    location: row.Location || "",
                },
                create: {
                    eventName: row.Event,
                    category: row.Category,
                    scope: row.Scope,
                    performance: String(row.Performance),
                    athleteName: row.Athlete,
                    date: recordDate,
                    location: row.Location || "",
                },
            });

            createdCount++;
        } catch (err) {
            console.error(`❌ Erreur pour ${row.Scope} ${row.Event}:`, err);
        }
    }

    console.log("\n✅ Import Records terminés !");
    console.log(`- Créés/Mis à jour : ${createdCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
