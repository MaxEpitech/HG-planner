
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: connectionString! });
const prisma = new PrismaClient({ adapter });

function parsePerformance(perf: string): number {
    const cleaned = perf.toLowerCase().replace(/[a-z]/g, '').replace(',', '.').trim();
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
}

async function main() {
    console.log("🔍 Checking Ranking Calculation Logic...");

    // 1. Get Records
    const officialRecords = await prisma.officialRecord.findMany({
        where: { scope: 'Europe' }
    });
    console.log(`🇪🇺 European Records: ${officialRecords.length}`);
    const recordsMap = new Map<string, number>();
    officialRecords.forEach(r => {
        recordsMap.set(r.eventName, parsePerformance(r.performance));
        console.log(`   - ${r.eventName}: ${r.performance} -> ${parsePerformance(r.performance)}`);
    });

    // 2. Get Athletes
    const athletes = await prisma.athlete.findMany({
        include: { personalRecords: true },
        take: 3 // Test with first 3 athletes
    });
    console.log(`👤 Testing with first ${athletes.length} athletes...`);

    // 3. Calc Points
    athletes.forEach(athlete => {
        console.log(`\nAthlete: ${athlete.firstName} ${athlete.lastName}`);
        let total = 0;
        athlete.personalRecords.forEach(pr => {
            const euroRecord = recordsMap.get(pr.eventName);
            if (euroRecord) {
                const perf = parsePerformance(pr.performance);
                const points = (perf / euroRecord) * 1000;
                console.log(`   - ${pr.eventName}: ${pr.performance} (${perf}) / ${euroRecord} * 1000 = ${points.toFixed(2)} pts`);
                total += points;
            } else {
                console.log(`   - ${pr.eventName}: No European Record found (Logic skipping)`);
            }
        });
        console.log(`   => TOTAL: ${total.toFixed(2)} pts`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
