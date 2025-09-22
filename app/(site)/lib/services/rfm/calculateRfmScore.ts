import { RFMRangeRule, RFMScore, RFMRules } from "@/app/(site)/lib/shared/types/RFM";

function getPointsFromRules(value: number, rules: RFMRangeRule[]): number {
  for (const rule of rules) {
    const { min, max, points } = rule;

    if (value >= min && (max === undefined || value <= max)) {
      return points;
    }
  }
  return 0;
}

/**
 * Calculates the RFM (Recency, Frequency, Monetary) score for a given set of RFM values and configuration rules.
 *
 * @param rfm - An object containing the recency, frequency, and monetary values (excluding the final score).
 * @param configs - The configuration object containing rules and weights for recency, frequency, and monetary calculations.
 * @returns An object containing the calculated points for recency, frequency, monetary, and the weighted final score.
 */
export default function calculateRfmScore(rfm: Omit<RFMScore, "finalScore">, configs: RFMRules): RFMScore {
  const { recency, frequency, monetary } = rfm;
  const recencyPoints = getPointsFromRules(recency, configs.recency.rules);
  const frequencyPoints = getPointsFromRules(frequency, configs.frequency.rules);
  const monetaryPoints = getPointsFromRules(monetary, configs.monetary.rules);

  // Weighted score
  const finalScore =
    recencyPoints * configs.recency.weight +
    frequencyPoints * configs.frequency.weight +
    monetaryPoints * configs.monetary.weight;

  return {
    recency: recencyPoints,
    frequency: frequencyPoints,
    monetary: monetaryPoints,
    finalScore,
  };
}
