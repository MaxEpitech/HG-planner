
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

async function dump() {
    console.log("📦 Dumping database to JSON...");

    const data = {
        federations: await prisma.federation.findMany(),
        users: await prisma.user.findMany(),
        officialRecords: await prisma.officialRecord.findMany(),
        competitions: await prisma.competition.findMany(),
        permissions: await prisma.competitionPermission.findMany(),
        groups: await prisma.group.findMany(),
        events: await prisma.event.findMany(),
        athletes: await prisma.athlete.findMany(),
        personalRecords: await prisma.personalRecord.findMany(),
        registrations: await prisma.registration.findMany(),
        results: await prisma.result.findMany(),
    };

    const filePath = path.join(process.cwd(), "backup.json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    console.log(`✅ Database dumped to ${filePath}`);
    console.log(`Summary:`);
    Object.entries(data).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value.length} items`);
    });
}

dump()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
