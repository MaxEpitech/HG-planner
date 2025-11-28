/**
 * Calcule les points pour un rang donné
 * 1er = 1 point, 2ème = 3 points, 3ème = 5 points, etc.
 * Formule: points = 1 + (rank - 1) * 2 = 2 * rank - 1
 */
export function calculatePoints(rank: number): number {
  if (rank < 1) {
    throw new Error("Le rang doit être supérieur ou égal à 1");
  }
  return rank;
}

/**
 * Calcule le total de points pour un athlète dans un groupe
 */
export function calculateTotalPoints(
  results: Array<{ points: number }>
): number {
  return results.reduce((total, result) => total + result.points, 0);
}

