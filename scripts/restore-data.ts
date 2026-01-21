
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ID Mappings to handle Seed collisions
const federationMap = new Map<string, string>(); // backupId -> realId
const userMap = new Map<string, string>();       // backupId -> realId
const athleteMap = new Map<string, string>();    // backupId -> realId

// Helper to remap IDs in an object
function remap<T>(item: T, mappings: { field: keyof T, map: Map<string, string> }[]): T {
    const newItem: any = { ...item };
    for (const { field, map } of mappings) {
        const val = newItem[field] as string;
        if (val && map.has(val)) {
            newItem[field] = map.get(val)!;
        }
    }
    return newItem as T;
}

async function restore() {
    const filePath = path.join(process.cwd(), "backup.json");
    console.log(`📦 Reading backup from ${filePath}...`);

    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        console.log("🚀 Starting restoration with Smart Merging...");

        // 1. Federations (Map by Slug)
        if (data.federations?.length) {
            console.log(`Processing ${data.federations.length} Federations...`);
            for (const item of data.federations) {
                const existing = await prisma.federation.findUnique({ where: { slug: item.slug } });
                if (existing) {
                    console.log(`   Featured merged: ${item.slug} (${item.id} -> ${existing.id})`);
                    federationMap.set(item.id, existing.id);
                    await prisma.federation.update({ where: { id: existing.id }, data: { ...item, id: existing.id } });
                } else {
                    await prisma.federation.upsert({ where: { id: item.id }, update: item, create: item });
                }
            }
        }

        // 2. Users (Map by Email)
        if (data.users?.length) {
            console.log(`Processing ${data.users.length} Users...`);
            for (const item of data.users) {
                // Remap Federation ID
                const mappedItem = remap(item, [{ field: 'federationId', map: federationMap }]);

                const existing = await prisma.user.findUnique({ where: { email: item.email } });
                if (existing) {
                    console.log(`   User merged: ${item.email} (${item.id} -> ${existing.id})`);
                    userMap.set(item.id, existing.id);
                    // Update content but keep ID
                    const { id, ...dataOfUser } = mappedItem;
                    await prisma.user.update({ where: { id: existing.id }, data: dataOfUser });
                } else {
                    await prisma.user.upsert({ where: { id: mappedItem.id }, update: mappedItem, create: mappedItem });
                }
            }
        }

        // 3. Official Records (No dependencies)
        if (data.officialRecords?.length) {
            console.log(`Restoring ${data.officialRecords.length} Official Records...`);
            for (const item of data.officialRecords) {
                await prisma.officialRecord.upsert({ where: { id: item.id }, update: item, create: item });
            }
        }

        // 4. Competitions (Depends on User, Federation)
        if (data.competitions?.length) {
            console.log(`Restoring ${data.competitions.length} Competitions...`);
            for (const item of data.competitions) {
                const mapped = remap(item, [
                    { field: 'ownerId', map: userMap },
                    { field: 'federationId', map: federationMap }
                ]);
                await prisma.competition.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
            }
        }

        // 5. App Permissions (Depends on User, Competition)
        if (data.permissions?.length) {
            console.log(`Restoring ${data.permissions.length} Permissions...`);
            for (const item of data.permissions) {
                const mapped = remap(item, [{ field: 'userId', map: userMap }]);

                // Also remap competitionId if we ever map competitions (not currently, but safe to check)

                await prisma.competitionPermission.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
            }
        }

        // 6. Groups (Depends on Competition)
        if (data.groups?.length) {
            console.log(`Restoring ${data.groups.length} Groups...`);
            for (const item of data.groups) {
                await prisma.group.upsert({ where: { id: item.id }, update: item, create: item });
            }
        }

        // 7. Events (Depends on Group)
        if (data.events?.length) {
            console.log(`Restoring ${data.events.length} Events...`);
            for (const item of data.events) {
                await prisma.event.upsert({ where: { id: item.id }, update: item, create: item });
            }
        }

        // 8. Athletes (Depends on User, Coach, Federation)
        if (data.athletes?.length) {
            console.log(`Restoring ${data.athletes.length} Athletes...`);
            for (const item of data.athletes) {
                const mapped = remap(item, [
                    { field: 'userId', map: userMap },
                    { field: 'coachId', map: userMap },
                    { field: 'federationId', map: federationMap }
                ]);

                // If userId is mapped, check for existing athlete on target user to merge
                try {
                    let shouldCreate = true;
                    if (mapped.userId) {
                        const existingAthlete = await prisma.athlete.findUnique({ where: { userId: mapped.userId } });
                        if (existingAthlete && existingAthlete.id !== mapped.id) {
                            console.log(`   Athlete merged on User: ${mapped.firstName} ${mapped.lastName} (${mapped.id} -> ${existingAthlete.id})`);

                            // IMPORTANT: Add to ID map
                            athleteMap.set(mapped.id, existingAthlete.id);

                            const { id, ...dataOfAthlete } = mapped;
                            await prisma.athlete.update({ where: { id: existingAthlete.id }, data: dataOfAthlete });
                            shouldCreate = false;
                        }
                    }
                    if (shouldCreate) {
                        await prisma.athlete.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
                    }
                } catch (e: any) {
                    console.error(`❌ Error athlete ${mapped.firstName} ${mapped.lastName}: ${e.message}`);
                }
            }
        }

        // 9. Personal Records (Depends on Athlete)
        if (data.personalRecords?.length) {
            console.log(`Restoring ${data.personalRecords.length} Personal Records...`);
            for (const item of data.personalRecords) {
                const mapped = remap(item, [{ field: 'athleteId', map: athleteMap }]);
                await prisma.personalRecord.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
            }
        }

        // 10. Registrations (Depends on Athlete, Group)
        if (data.registrations?.length) {
            console.log(`Restoring ${data.registrations.length} Registrations...`);
            for (const item of data.registrations) {
                const mapped = remap(item, [{ field: 'athleteId', map: athleteMap }]);
                await prisma.registration.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
            }
        }

        // 11. Results (Depends on Athlete, Event)
        if (data.results?.length) {
            console.log(`Restoring ${data.results.length} Results...`);
            for (const item of data.results) {
                const mapped = remap(item, [{ field: 'athleteId', map: athleteMap }]);
                await prisma.result.upsert({ where: { id: mapped.id }, update: mapped, create: mapped });
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
