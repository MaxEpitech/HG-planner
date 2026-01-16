
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables specially for local execution
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

async function main() {
    if (!connectionString) {
        console.error("DATABASE_URL is not defined in .env or .env.local");
        process.exit(1);
    }

    // Use the same adapter strategy as the app to ensure consistency
    // This fixes the "__internal" error seen with the default constructor
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Checking if Competition table exists by querying it...");
        const count = await prisma.competition.count();
        console.log(`Success! Found ${count} competitions.`);

        const first = await prisma.competition.findFirst();
        if (first) {
            console.log("Found a competition:", first.id);
        } else {
            console.log("No competitions found (table exists but is empty of data).");
        }

    } catch (e) {
        console.error("Error querying Competition table:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
