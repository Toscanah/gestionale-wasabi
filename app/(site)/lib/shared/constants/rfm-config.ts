import { RFMRankRule, RFMConfig, RFMRules } from "../types/RFM";

export const DEFAULT_RULES: RFMRules = {
  recency: {
    // Recency in days: lower = better
    rules: [
      { min: 0, max: 14, points: 5 }, // bought within 2 weeks
      { min: 15, max: 45, points: 4 }, // within ~1.5 months
      { min: 46, max: 90, points: 3 }, // within 3 months
      { min: 91, max: 180, points: 2 }, // within 6 months
      { min: 181, max: 365, points: 1 }, // within a year
      { min: 366, points: 0 }, // > 1 year ago
    ],
    weight: 0.5,
  },
  frequency: {
    // Number of orders in the time window
    rules: [
      { min: 0, max: 0, points: 0 }, // no orders
      { min: 1, max: 2, points: 2 }, // occasional
      { min: 3, max: 4, points: 3 }, // steady
      { min: 5, max: 7, points: 4 }, // frequent
      { min: 8, points: 5 }, // very frequent
    ],
    weight: 0.3,
  },
  monetary: {
    // Average spending (€, or whatever currency)
    rules: [
      { min: 0, max: 19, points: 1 }, // very low spenders
      { min: 20, max: 49, points: 2 }, // low spenders
      { min: 50, max: 149, points: 3 }, // medium spend
      { min: 150, max: 299, points: 4 }, // high spend
      { min: 300, points: 5 }, // top spenders
    ],
    weight: 0.2,
  },
};

export const DEFAULT_RANK_RULE: Omit<RFMRankRule, "rank"> = {
  priority: 0,
  minRecency: undefined,
  maxRecency: undefined,
  minFrequency: undefined,
  maxFrequency: undefined,
  minMonetary: undefined,
  maxMonetary: undefined,
};

export const DEFAULT_RANKS: RFMRankRule[] = [
  {
    rank: "VIP", // best in all three dimensions
    priority: 100,
    minRecency: 4,
    maxRecency: 5,
    minFrequency: 4,
    maxFrequency: 5,
    minMonetary: 4,
    maxMonetary: 5,
  },
  {
    rank: "Premium", // or "Loyal", "Premium"
    priority: 90,
    minRecency: 4,
    maxRecency: 5,
    minFrequency: 4,
    maxFrequency: 5,
    minMonetary: 1, // 👈 allows lower monetary than VIP
    maxMonetary: 3, // 👈 caps it before "big spenders"
  },
  {
    rank: "Regolare", // solid customers, active & decent spend
    priority: 80,
    minRecency: 3,
    maxRecency: 5,
    minFrequency: 2,
    maxFrequency: 5,
    minMonetary: 2,
    maxMonetary: 5,
  },
  {
    rank: "Promettente",
    priority: 70,
    minRecency: 4,
    maxRecency: 5,
    minFrequency: 1,
    maxFrequency: 3,
    minMonetary: 1,
    maxMonetary: 3,
  },

  {
    rank: "Nuovo", // recently active but low frequency/spend
    priority: 60,
    minRecency: 4,
    maxRecency: 5,
    minFrequency: 0,
    maxFrequency: 2,
    minMonetary: 0,
    maxMonetary: 2,
  },
  {
    rank: "A rischio", // used to be good, but not recent
    priority: 50,
    minRecency: 2,
    maxRecency: 3,
    minFrequency: 0,
    maxFrequency: 5,
    minMonetary: 0,
    maxMonetary: 5,
  },
  {
    rank: "In calo",
    priority: 45,
    minRecency: 2,
    maxRecency: 3,
    minFrequency: 1,
    maxFrequency: 3,
    minMonetary: 1,
    maxMonetary: 3,
  },

  {
    rank: "Valore basso", // consistently low contribution
    priority: 40,
    minRecency: 2,
    maxRecency: 5,
    minFrequency: 0,
    maxFrequency: 2,
    minMonetary: 0,
    maxMonetary: 2,
  },
  {
    rank: "Perso",
    priority: 30,
    minRecency: 0,
    maxRecency: 1,
    minFrequency: 0,
    maxFrequency: 1,
    minMonetary: 0,
    maxMonetary: 2,
  },

  {
    rank: "Inattivo",
    priority: 20,
    minRecency: 0,
    maxRecency: 1,
    minFrequency: 0,
    maxFrequency: 2,
    minMonetary: 0,
    maxMonetary: 5, // 👈 allow all monetary values
  },
];

export const DEFAULT_RFM_CONFIG: RFMConfig = {
  rules: DEFAULT_RULES,
  ranks: DEFAULT_RANKS,
};
