import { RFMRangeRule, RFMScore, RFMRules } from "@/app/(site)/lib/shared/types/RFM";

function normalizeRules(rules: RFMRangeRule[]): RFMRangeRule[] {
  if (!Array.isArray(rules)) return [];

  // Remove invalid entries
  const valid = rules
    .filter((r) => typeof r.min === "number" && !isNaN(r.min))
    .map((r) => ({
      min: Math.max(0, r.min),
      max: typeof r.max === "number" && !isNaN(r.max) ? r.max : undefined,
      points: typeof r.points === "number" && !isNaN(r.points) ? r.points : 0,
    }));

  // Sort ascending
  valid.sort((a, b) => a.min - b.min);

  // Auto-resolve overlaps (keep first rule priority)
  const resolved: RFMRangeRule[] = [];
  for (const rule of valid) {
    const prev = resolved.at(-1);
    if (prev && prev.max !== undefined && rule.min <= prev.max) {
      // Shift start just after previous max
      rule.min = prev.max + Number.EPSILON; // tiny gap to avoid equality conflicts
    }
    if (rule.max !== undefined && rule.max < rule.min) {
      // swap if needed
      rule.max = rule.min;
    }
    resolved.push(rule);
  }

  return resolved;
}

function getPointsFromRules(value: number, rawRules: RFMRangeRule[]): number {
  if (isNaN(value)) return 0;

  const rules = normalizeRules(rawRules);

  for (const { min, max, points } of rules) {
    if (value >= min && (max === undefined || value <= max)) {
      return points;
    }
  }

  return 0;
}

export default function calculateRfmScore(
  rfm: Omit<RFMScore, "finalScore">,
  configs: RFMRules
): RFMScore {
  const safeWeight = (w: number | undefined) => (typeof w === "number" && !isNaN(w) ? w : 0);

  const recencyPoints = getPointsFromRules(rfm.recency, configs.recency?.rules ?? []);
  const frequencyPoints = getPointsFromRules(rfm.frequency, configs.frequency?.rules ?? []);
  const monetaryPoints = getPointsFromRules(rfm.monetary, configs.monetary?.rules ?? []);

  const finalScore =
    recencyPoints * safeWeight(configs.recency?.weight) +
    frequencyPoints * safeWeight(configs.frequency?.weight) +
    monetaryPoints * safeWeight(configs.monetary?.weight);

  return {
    recency: recencyPoints,
    frequency: frequencyPoints,
    monetary: monetaryPoints,
    finalScore,
  };
}
