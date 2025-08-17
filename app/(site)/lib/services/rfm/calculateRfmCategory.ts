import { RFMRankConfig, RFMScore } from "../../shared/types/RFM";

export default function calculateRfmCategory(score: RFMScore, rules: RFMRankConfig): string {
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    if (
      (rule.minRecency === undefined || score.recency >= rule.minRecency) &&
      (rule.maxRecency === undefined || score.recency <= rule.maxRecency) &&
      (rule.minFrequency === undefined || score.frequency >= rule.minFrequency) &&
      (rule.maxFrequency === undefined || score.frequency <= rule.maxFrequency) &&
      (rule.minMonetary === undefined || score.monetary >= rule.minMonetary) &&
      (rule.maxMonetary === undefined || score.monetary <= rule.maxMonetary) &&
      (rule.minFinalScore === undefined || score.finalScore >= rule.minFinalScore) &&
      (rule.maxFinalScore === undefined || score.finalScore <= rule.maxFinalScore)
    ) {
      return rule.rank;
    }
  }

  // fallback
  return "regular";
}
