// Badge definitions for Highland Games achievements
export type BadgeCategory =
    | "first_steps"    // Premiers pas
    | "consistency"    // Régularité
    | "performance"    // Performances
    | "podium"         // Podiums
    | "discipline"     // Discipline spécifique
    | "special";       // Événements spéciaux

export type BadgeId =
    | "first_competition"
    | "first_podium"
    | "first_victory"
    | "winning_streak"
    | "regular_athlete"
    | "veteran"
    | "iron_man"
    | "stone_master"
    | "caber_king"
    | "weight_champion"
    | "scottish_spirit";

export interface Badge {
    id: BadgeId;
    name: string;
    description: string;
    icon: string;
    category: BadgeCategory;
    rarity: "common" | "rare" | "epic" | "legendary";
    condition: {
        type: "count" | "streak" | "rank" | "discipline" | "custom";
        value: number;
        field?: string;
    };
}

export const BADGES: Record<BadgeId, Badge> = {
    first_competition: {
        id: "first_competition",
        name: "Premier Pas",
        description: "Participer à votre première compétition Highland Games",
        icon: "🎯",
        category: "first_steps",
        rarity: "common",
        condition: { type: "count", value: 1, field: "competitions" },
    },

    first_podium: {
        id: "first_podium",
        name: "Premier Podium",
        description: "Terminer dans le top 3 pour la première fois",
        icon: "🥇",
        category: "podium",
        rarity: "rare",
        condition: { type: "rank", value: 3, field: "bestRank" },
    },

    first_victory: {
        id: "first_victory",
        name: "Première Victoire",
        description: "Remporter votre première épreuve",
        icon: "🏆",
        category: "podium",
        rarity: "epic",
        condition: { type: "count", value: 1, field: "victories" },
    },

    winning_streak: {
        id: "winning_streak",
        name: "Série de Victoires",
        description: "Remporter 3 compétitions consécutives",
        icon: "🔥",
        category: "performance",
        rarity: "epic",
        condition: { type: "streak", value: 3, field: "victories" },
    },

    regular_athlete: {
        id: "regular_athlete",
        name: "Régularité",
        description: "Participer à au moins 5 compétitions sur une année",
        icon: "🎯",
        category: "consistency",
        rarity: "rare",
        condition: { type: "count", value: 5, field: "yearlyCompetitions" },
    },

    veteran: {
        id: "veteran",
        name: "Vétéran",
        description: "Participer à plus de 10 Highland Games",
        icon: "⭐",
        category: "consistency",
        rarity: "epic",
        condition: { type: "count", value: 10, field: "competitions" },
    },

    iron_man: {
        id: "iron_man",
        name: "Iron Man",
        description: "Compléter toutes les épreuves d'une compétition",
        icon: "💪",
        category: "discipline",
        rarity: "rare",
        condition: { type: "custom", value: 1 },
    },

    stone_master: {
        id: "stone_master",
        name: "Maître de la Pierre",
        description: "Remporter 3 épreuves de Stone Put",
        icon: "🪨",
        category: "discipline",
        rarity: "rare",
        condition: { type: "count", value: 3, field: "stonePutVictories" },
    },

    caber_king: {
        id: "caber_king",
        name: "Roi du Caber",
        description: "Remporter 3 épreuves de Caber Toss",
        icon: "🌲",
        category: "discipline",
        rarity: "rare",
        condition: { type: "count", value: 3, field: "caberVictories" },
    },

    weight_champion: {
        id: "weight_champion",
        name: "Champion de Force",
        description: "Remporter 3 épreuves de Weight for Distance",
        icon: "⚡",
        category: "discipline",
        rarity: "rare",
        condition: { type: "count", value: 3, field: "weightVictories" },
    },

    scottish_spirit: {
        id: "scottish_spirit",
        name: "Esprit Écossais",
        description: "Participer à 10+ compétitions Highland Games",
        icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        category: "special",
        rarity: "legendary",
        condition: { type: "count", value: 10, field: "competitions" },
    },
};

// Helper function to check if a badge is unlocked
export function isBadgeUnlocked(badge: Badge, athleteStats: any): boolean {
    const { condition } = badge;

    switch (condition.type) {
        case "count":
            return athleteStats[condition.field!] >= condition.value;

        case "rank":
            return athleteStats.bestRank && athleteStats.bestRank <= condition.value;

        case "streak":
            // Would need streak tracking logic
            return false; // Placeholder

        case "custom":
            // Custom logic per badge
            return false; // Placeholder

        default:
            return false;
    }
}

// Get badge progress (0-100%)
export function getBadgeProgress(badge: Badge, athleteStats: any): number {
    const { condition } = badge;

    if (condition.type === "count" && condition.field) {
        const current = athleteStats[condition.field] || 0;
        return Math.min(100, (current / condition.value) * 100);
    }

    return isBadgeUnlocked(badge, athleteStats) ? 100 : 0;
}
