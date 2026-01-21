
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// On the server, we assume standard DATABASE_URL is set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function restore() {
    const filePath = path.join(process.cwd(), "backup.json");
    console.log(`📦 Reading backup from ${filePath}...`);

    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        console.log("🚀 Starting restoration...");

        // 1. Federations
        if (data.federations?.length) {
            console.log(`Restoring ${data.federations.length} Federations...`);
            for (const item of data.federations) {
                // Check slug conflict
                const existingBySlug = await prisma.federation.findUnique({ where: { slug: item.slug } });
                if (existingBySlug && existingBySlug.id !== item.id) {
                    console.log(`⚠️ Federation conflict (slug: ${item.slug}). Deleting existing ${existingBySlug.id}...`);
                    await prisma.federation.delete({ where: { id: existingBySlug.id } });
                }

                await prisma.federation.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 2. Users
        if (data.users?.length) {
            console.log(`Restoring ${data.users.length} Users...`);
            for (const item of data.users) {
                // Check email conflict
                const existingByEmail = await prisma.user.findUnique({ where: { email: item.email } });
                if (existingByEmail && existingByEmail.id !== item.id) {
                    console.log(`⚠️ User conflict (email: ${item.email}). Deleting existing ${existingByEmail.id}...`);
                    try {
                        await prisma.user.delete({ where: { id: existingByEmail.id } });
                    } catch (e) {
                        console.error(`❌ Failed to delete user ${existingByEmail.id}. Please manually clean or verify dependencies.`);
                        throw e;
                    }
                }

                await prisma.user.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 3. Official Records
        if (data.officialRecords?.length) {
            console.log(`Restoring ${data.officialRecords.length} Official Records...`);
            for (const item of data.officialRecords) {
                await prisma.officialRecord.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 4. Competitions
        if (data.competitions?.length) {
            console.log(`Restoring ${data.competitions.length} Competitions...`);
            for (const item of data.competitions) {
                await prisma.competition.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 5. App Permissions
        if (data.permissions?.length) {
            console.log(`Restoring ${data.permissions.length} Permissions...`);
            for (const item of data.permissions) {
                await prisma.competitionPermission.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 6. Groups
        if (data.groups?.length) {
            console.log(`Restoring ${data.groups.length} Groups...`);
            for (const item of data.groups) {
                await prisma.group.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 7. Events
        if (data.events?.length) {
            console.log(`Restoring ${data.events.length} Events...`);
            for (const item of data.events) {
                await prisma.event.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 8. Athletes
        if (data.athletes?.length) {
            console.log(`Restoring ${data.athletes.length} Athletes...`);
            for (const item of data.athletes) {
                await prisma.athlete.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 9. Personal Records
        if (data.personalRecords?.length) {
            console.log(`Restoring ${data.personalRecords.length} Personal Records...`);
            for (const item of data.personalRecords) {
                await prisma.personalRecord.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 10. Registrations
        if (data.registrations?.length) {
            console.log(`Restoring ${data.registrations.length} Registrations...`);
            for (const item of data.registrations) {
                await prisma.registration.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        // 11. Results
        if (data.results?.length) {
            console.log(`Restoring ${data.results.length} Results...`);
            for (const item of data.results) {
                await prisma.result.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
            }
        }

        console.log("✅ Restoration completed successfully!");

    } catch (error) {
        console.error("❌ Error during restoration:", error);
    }
}

restore()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
