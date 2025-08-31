import {
  RFMRangeRule,
  RFMScore,
  RFMRules,
} from "@/app/(site)/lib/shared/types/rfm";

function getPointsFromRules(value: number, rules: RFMRangeRule[]): number {
  for (const rule of rules) {
    const { min, max, points } = rule;

    if (value >= min && (max === undefined || value <= max)) {
      return points;
    }
  }
  return 0; // default if no rule matched
}

export function calculateRfmScore(
  rfm: Omit<RFMScore, "finalScore">,
  configs: RFMRules
): RFMScore {
  // Extract raw stats
  const { recency, frequency, monetary } = rfm;

  // Recency: lower is better → so rules are written in days
  const recencyPoints = getPointsFromRules(recency, configs.recency.rules);

  // Frequency: higher is better
  const frequencyPoints = getPointsFromRules(frequency, configs.frequency.rules);

  // Monetary: higher is better
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
