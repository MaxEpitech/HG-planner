"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

const FEDERATION_SCOPE_MAP: Record<string, string[]> = {
    FR: ["France", "Europe"],
    NL: ["Hollande", "Pays-Bas", "Europe"],
    BE: ["Belgique", "Europe"],
    DE: ["Allemagne", "Europe"],
    CH: ["Suisse", "Europe"],
    // EU implies all, or at least Europe. If EU, we might want to show ALL records from all countries?
    // Or just "Europe" official records? 
    // User said "pour la france ... ranking visible sont seulement le ranking francais et europeen"
    // Implies strict filtering.
    // For EU context, let's show ALL for now (no filter).
};

export async function getOfficialRecords() {
    try {
        const cookieStore = await cookies();
        const federationContext = cookieStore.get("hg_federation_context")?.value || "EU";

        const allowedScopes = FEDERATION_SCOPE_MAP[federationContext];
        const whereClause = allowedScopes ? { scope: { in: allowedScopes } } : {};

        const records = await prisma.officialRecord.findMany({
            where: whereClause,
            orderBy: [
                { scope: "asc" },
                { eventName: "asc" },
                { category: "asc" },
            ],
        });
        return { success: true, data: records };
    } catch (error) {
        console.error("Error fetching official records:", error);
        return { success: false, error: "Failed to fetch records" };
    }
}

import { getCurrentUser } from "@/lib/auth/session";
import { canManageOfficialRecords } from "@/lib/auth/roles";

export async function createOfficialRecord(data: {
    eventName: string;
    category: string;
    scope: string;
    performance: string;
    athleteName: string;
    date?: Date;
    location?: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user || !canManageOfficialRecords(user.role)) {
            return { success: false, error: "Non autorisé" };
        }

        const record = await prisma.officialRecord.create({
            data: {
                ...data,
                date: data.date || new Date(),
            },
        });
        revalidatePath("/admin/records");
        return { success: true, data: record };
    } catch (error: any) {
        console.error("Error creating official record:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Un record existe déjà pour cette épreuve/catégorie/portée." };
        }
        return { success: false, error: "Erreur lors de la création du record" };
    }
}

export async function updateOfficialRecord(
    id: string,
    data: {
        eventName?: string;
        category?: string;
        scope?: string;
        performance?: string;
        athleteName?: string;
        date?: Date;
        location?: string;
    }
) {
    try {
        const record = await prisma.officialRecord.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/records");
        return { success: true, data: record };
    } catch (error) {
        console.error("Error updating official record:", error);
        return { success: false, error: "Failed to update record" };
    }
}

export async function deleteOfficialRecord(id: string) {
    try {
        await prisma.officialRecord.delete({
            where: { id },
        });
        revalidatePath("/admin/records");
        return { success: true };
    } catch (error) {
        console.error("Error deleting official record:", error);
        return { success: false, error: "Failed to delete record" };
    }
}
