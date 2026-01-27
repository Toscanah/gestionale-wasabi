import { RFMRankRule, RFMScore } from "../../shared/types/RFM";

/**
 * Calculates the RFM (Recency, Frequency, Monetary) rank for a given score based on ranking rules.
 * 
 * This function takes an RFM score and a set of ranking rules, then determines which rank
 * the score falls into based on the defined thresholds. Rules are processed in priority
 * order (highest priority first) and the first matching rule's rank is returned.
 * 
 * @param score - The RFM score object containing recency, frequency, and monetary values
 * @param rawRules - Array of RFM ranking rules defining ranges and associated ranks
 * 
 * @returns The rank string from the first matching rule, or undefined if no rules match
 *          or if the input parameters are invalid
 * 
 * @remarks
 * - Rules are automatically normalized to ensure valid numeric ranges (min >= 0, max >= min)
 * - Rules with invalid or empty rank strings are filtered out
 * - Rules are sorted by priority in descending order before matching
 * - A rule matches when the score falls within all defined min/max boundaries
 * - Undefined min/max values in rules are treated as "no limit" for that boundary
 */
export default function calculateRfmRank(
  score: RFMScore,
  rawRules: RFMRankRule[]
): RFMRankRule["rank"] | undefined {
  if (!score || typeof score !== "object") return undefined;

  // --- 1️⃣ Normalize all rules defensively ---
  const rules = rawRules
    .filter((r) => typeof r.rank === "string" && r.rank.trim() !== "")
    .map((r) => ({
      ...r,
      // Ensure numeric safety and fix invalid ranges
      minRecency:
        typeof r.minRecency === "number" && !isNaN(r.minRecency)
          ? Math.max(0, r.minRecency)
          : undefined,
      maxRecency:
        typeof r.maxRecency === "number" && !isNaN(r.maxRecency)
          ? Math.max(r.minRecency ?? 0, r.maxRecency)
          : undefined,

      minFrequency:
        typeof r.minFrequency === "number" && !isNaN(r.minFrequency)
          ? Math.max(0, r.minFrequency)
          : undefined,
      maxFrequency:
        typeof r.maxFrequency === "number" && !isNaN(r.maxFrequency)
          ? Math.max(r.minFrequency ?? 0, r.maxFrequency)
          : undefined,

      minMonetary:
        typeof r.minMonetary === "number" && !isNaN(r.minMonetary)
          ? Math.max(0, r.minMonetary)
          : undefined,
      maxMonetary:
        typeof r.maxMonetary === "number" && !isNaN(r.maxMonetary)
          ? Math.max(r.minMonetary ?? 0, r.maxMonetary)
          : undefined,

      priority: typeof r.priority === "number" && !isNaN(r.priority) ? r.priority : 0,
    }))
    // sort rules by priority descending so we can pick the first match efficiently
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  if (rules.length === 0) return undefined;

  // --- 2️⃣ Match rules safely ---
  for (const rule of rules) {
    const match =
      (rule.minRecency === undefined || score.recency >= rule.minRecency) &&
      (rule.maxRecency === undefined || score.recency <= rule.maxRecency) &&
      (rule.minFrequency === undefined || score.frequency >= rule.minFrequency) &&
      (rule.maxFrequency === undefined || score.frequency <= rule.maxFrequency) &&
      (rule.minMonetary === undefined || score.monetary >= rule.minMonetary) &&
      (rule.maxMonetary === undefined || score.monetary <= rule.maxMonetary);

    if (match) return rule.rank;
  }

  return undefined;
}
