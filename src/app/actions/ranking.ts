
'use server';

import { prisma } from "@/lib/prisma";

export type RankedAthlete = {
    id: string;
    firstName: string;
    lastName: string;
    club: string | null;
    totalPoints: number;
    details: {
        eventName: string;
        performance: number;
        points: number;
    }[];
};

function parsePerformance(perf: string): number {
    // Remove 'm' or other non-numeric chars except dot/comma, replace comma with dot
    const cleaned = perf.toLowerCase().replace(/[a-z]/g, '').replace(',', '.').trim();
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
}

export async function getEuropeanRanking() {
    try {
        // 1. Fetch all European Records to use as base
        const officialRecords = await prisma.officialRecord.findMany({
            where: { scope: 'Europe' }
        });

        // Create a map for quick lookup: eventName -> performance (number)
        const recordsMap = new Map<string, number>();
        officialRecords.forEach((r) => {
            recordsMap.set(r.eventName, parsePerformance(r.performance));
        });

        // 2. Fetch all Athletes with their Personal Records
        const athletes = await prisma.athlete.findMany({
            include: {
                personalRecords: true
            }
        });

        // 3. Calculate points for each athlete
        const rankedAthletes: RankedAthlete[] = athletes.map((athlete) => {
            let totalPoints = 0;
            const details: RankedAthlete['details'] = [];

            athlete.personalRecords.forEach((pr) => {
                const eventName = pr.eventName;
                const euroRecord = recordsMap.get(eventName);

                // Calculate only if we have a matching European record and it's valid (> 0)
                if (euroRecord && euroRecord > 0) {
                    const athletePerf = parsePerformance(pr.performance);
                    if (athletePerf > 0) {
                        // Formula: (perf_athlete / record_europe) * 1000
                        const points = (athletePerf / euroRecord) * 1000;

                        // Add to total
                        totalPoints += points;

                        details.push({
                            eventName,
                            performance: athletePerf,
                            points
                        });
                    }
                }
            });

            return {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                club: athlete.club,
                totalPoints,
                details
            };
        });

        // 4. Sort by Total Points Descending
        rankedAthletes.sort((a, b) => b.totalPoints - a.totalPoints);

        // Filter out athletes with 0 points (optional, maybe keep them ?)
        // Let's keep only those with at least one valid performance for the ranking
        const activeAthletes = rankedAthletes.filter(a => a.totalPoints > 0);

        return { success: true, data: activeAthletes };

    } catch (error) {
        console.error("Error calculating European Ranking:", error);
        return { success: false, error: "Failed to calculate ranking" };
    }
}
