import { RFMRankRule, RFMScore } from "../../shared/types/rfm";

/**
 * Calculates the RFM (Recency, Frequency, Monetary) rank for a given score based on a set of ranking rules.
 *
 * Iterates through the provided `rules` and determines which rule best matches the given `score`.
 * A rule matches if all its defined min/max constraints are satisfied by the score.
 * If multiple rules match, the one with the highest `priority` is selected.
 *
 * @param score - The RFM score object containing recency, frequency, and monetary values.
 * @param rules - An array of RFM ranking rules to evaluate against the score.
 * @returns The `rank` value from the best matching rule, or `undefined` if no rules match.
 */
export default function calculateRfmRank(
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
