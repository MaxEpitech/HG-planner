
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

async function main() {
    if (!connectionString) {
        console.error("DATABASE_URL is not defined in .env or .env.local");
        process.exit(1);
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Fetching all competitions to check their status...");
        const competitions = await prisma.competition.findMany();

        if (competitions.length === 0) {
            console.log("No competitions found in the database.");
        } else {
            console.log(`Found ${competitions.length} competitions:`);
            competitions.forEach(c => {
                console.log(`- [${c.id}] ${c.name} | Status: '${c.status}' | Date: ${c.startDate}`);
            });
        }

    } catch (e) {
        console.error("Error querying Competition table:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
