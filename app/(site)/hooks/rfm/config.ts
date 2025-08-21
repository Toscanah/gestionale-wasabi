import { RFMRankRule, RFMConfig, RFMRules } from "../../lib/shared/types/RFM";

export const DEFAULT_RULES: RFMRules = {
  recency: {
    rules: [
      { min: 0, max: 7, points: 5 },
      { min: 8, max: 14, points: 4 },
      { min: 15, max: 21, points: 3 },
      { min: 22, max: 30, points: 2 },
      { min: 31, max: 60, points: 1 },
      { min: 61, points: 0 },
    ],
    weight: 0.5,
  },
  frequency: {
    rules: [
      { min: 1, max: 1, points: 1 },
      { min: 2, max: 2, points: 2 },
      { min: 3, max: 3, points: 3 },
      { min: 4, max: 4, points: 4 },
      { min: 5, points: 5 },
    ],
    weight: 0.3,
  },
  monetary: {
    rules: [
      { min: 50, max: 149, points: 1 },
      { min: 150, max: 299, points: 2 },
      { min: 300, max: 499, points: 3 },
      { min: 500, max: 799, points: 4 },
      { min: 800, points: 5 },
    ],
    weight: 0.2,
  },
};

export const DEFAULT_RANK_RULE: Omit<RFMRankRule, "rank"> = {
  minRecency: 0,
  maxRecency: 0,
  minFrequency: 0,
  maxFrequency: 0,
  minMonetary: 0,
  maxMonetary: 0,
};

export const DEFAULT_RANKS: RFMRankRule[] = [
  // {
  //   rank: "Perso",
  //   ...DEFAULT_RANK_RULE,
  // },
  // {
  //   rank: "Inattivo",
  //   ...DEFAULT_RANK_RULE,
  // },
  // {
  //   rank: "VIP",
  //   ...DEFAULT_RANK_RULE,
  // },
  // {
  //   rank: "regolare",
  //   ...DEFAULT_RANK_RULE,
  // },
];

export const DEFAULT_RFM_CONFIG: RFMConfig = {
  rules: DEFAULT_RULES,
  ranks: DEFAULT_RANKS,
};
