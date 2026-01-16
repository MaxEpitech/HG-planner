// scripts/verify-db.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    try {
        console.log("Checking if Competition table exists by querying it...");
        const count = await prisma.competition.count();
        console.log(`Success! Found \${count} competitions.`);
    } catch (e) {
        console.error("Error querying Competition table:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}
main();
