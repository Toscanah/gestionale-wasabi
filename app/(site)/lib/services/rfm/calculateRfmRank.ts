import { RFMRankRule, RFMScore } from "../../shared/types/RFM";

export function calculateRfmRank(
  score: RFMScore,
  rules: RFMRankRule[]
): RFMRankRule["rank"] | undefined {
  let bestMatch: RFMRankRule | undefined;

  for (const rule of rules) {
    const match =
      (rule.minRecency === undefined || score.recency >= rule.minRecency) &&
      (rule.maxRecency === undefined || score.recency <= rule.maxRecency) &&
      (rule.minFrequency === undefined || score.frequency >= rule.minFrequency) &&
      (rule.maxFrequency === undefined || score.frequency <= rule.maxFrequency) &&
      (rule.minMonetary === undefined || score.monetary >= rule.minMonetary) &&
      (rule.maxMonetary === undefined || score.monetary <= rule.maxMonetary);

    if (match) {
      if (!bestMatch || (rule.priority ?? 0) > (bestMatch.priority ?? 0)) {
        bestMatch = rule;
      }
    }
  }

  return bestMatch?.rank;
}
