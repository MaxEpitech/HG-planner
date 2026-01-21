
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const sourceUrl = process.env.DATABASE_URL;
const destUrl = process.env.REMOTE_DATABASE_URL;

if (!sourceUrl) throw new Error("DATABASE_URL is missing");
if (!destUrl) throw new Error("REMOTE_DATABASE_URL is missing");

console.log("🚀 Starting migration...");
console.log(`Source: ${sourceUrl.split('@')[1]}`); // Mask credentials
console.log(`Dest:   ${destUrl.split('@')[1]}`);

const sourcePrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: sourceUrl }) });
const destPrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: destUrl }) });

async function migrate() {
    // 1. Federations
    const federations = await sourcePrisma.federation.findMany();
    console.log(`Migrating ${federations.length} Federations...`);
    for (const fed of federations) {
        await destPrisma.federation.upsert({
            where: { id: fed.id },
            update: fed,
            create: fed,
        });
    }

    // 2. Users (Accounts/Sessions/VerificationTokens usually generated, but Users are core)
    const users = await sourcePrisma.user.findMany();
    console.log(`Migrating ${users.length} Users...`);
    for (const user of users) {
        await destPrisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
        });
    }

    // 3. Official Records (Independent)
    const officialRecords = await sourcePrisma.officialRecord.findMany();
    console.log(`Migrating ${officialRecords.length} Official Records...`);
    for (const record of officialRecords) {
        await destPrisma.officialRecord.upsert({
            where: { id: record.id },
            update: record,
            create: record,
        });
    }

    // 4. Competitions
    const competitions = await sourcePrisma.competition.findMany();
    console.log(`Migrating ${competitions.length} Competitions...`);
    for (const comp of competitions) {
        await destPrisma.competition.upsert({
            where: { id: comp.id },
            update: comp,
            create: comp,
        });
    }

    // 4.1 Competition Permissions
    const perms = await sourcePrisma.competitionPermission.findMany();
    console.log(`Migrating ${perms.length} Permissions...`);
    for (const perm of perms) {
        await destPrisma.competitionPermission.upsert({
            where: { id: perm.id },
            update: perm,
            create: perm,
        });
    }

    // 5. Groups
    const groups = await sourcePrisma.group.findMany();
    console.log(`Migrating ${groups.length} Groups...`);
    for (const group of groups) {
        await destPrisma.group.upsert({
            where: { id: group.id },
            update: group,
            create: group,
        });
    }

    // 6. Events
    const events = await sourcePrisma.event.findMany();
    console.log(`Migrating ${events.length} Events...`);
    for (const event of events) {
        await destPrisma.event.upsert({
            where: { id: event.id },
            update: event,
            create: event,
        });
    }

    // 7. Athletes
    const athletes = await sourcePrisma.athlete.findMany();
    console.log(`Migrating ${athletes.length} Athletes...`);
    for (const athlete of athletes) {
        await destPrisma.athlete.upsert({
            where: { id: athlete.id },
            update: athlete,
            create: athlete,
        });
    }

    // 8. Personal Records
    const prs = await sourcePrisma.personalRecord.findMany();
    console.log(`Migrating ${prs.length} Personal Records...`);
    for (const pr of prs) {
        await destPrisma.personalRecord.upsert({
            where: { id: pr.id },
            update: pr,
            create: pr,
        });
    }

    // 9. Registrations
    const registrations = await sourcePrisma.registration.findMany();
    console.log(`Migrating ${registrations.length} Registrations...`);
    for (const reg of registrations) {
        await destPrisma.registration.upsert({
            where: { id: reg.id },
            update: reg,
            create: reg,
        });
    }

    // 10. Results
    const results = await sourcePrisma.result.findMany();
    console.log(`Migrating ${results.length} Results...`);
    for (const result of results) {
        await destPrisma.result.upsert({
            where: { id: result.id },
            update: result,
            create: result,
        });
    }

    console.log("✅ Migration completed successfully!");
}

migrate()
    .catch(console.error)
    .finally(async () => {
        await sourcePrisma.$disconnect();
        await destPrisma.$disconnect();
    });
