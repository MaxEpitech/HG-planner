
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: connectionString! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const records = await prisma.officialRecord.groupBy({
        by: ['scope'],
        _count: {
            id: true
        }
    });

    console.log("📊 Official Records Summary:");
    records.forEach(r => {
        console.log(`- ${r.scope}: ${r._count.id} records`);
    });

    const euroRecords = await prisma.officialRecord.findMany({
        where: { scope: 'Europe' },
        select: { eventName: true, performance: true }
    });

    if (euroRecords.length > 0) {
        console.log("\n🇪🇺 European Records found:", euroRecords.length);
        console.log(euroRecords.map(r => `${r.eventName}: ${r.performance}`).join('\n'));
    } else {
        console.log("\n⚠️ No European records found. Ranking calculation will be impossible.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
