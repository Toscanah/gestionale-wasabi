import { RFMRankRule, RFMConfig, RFMRules } from "../types/RFM";

export const DEFAULT_RULES: RFMRules = {
  recency: {
    rules: [
      {
        min: 0,
        max: 7,
        points: 5,
      },
      {
        min: 8,
        max: 14,
        points: 4,
      },
      {
        min: 15,
        max: 21,
        points: 3,
      },
      {
        min: 22,
        max: 30,
        points: 2,
      },
      {
        min: 31,
        max: 60,
        points: 1,
      },
      {
        min: 61,
        points: 0,
      },
    ],
    weight: 0.5,
  },
  frequency: {
    rules: [
      {
        min: 0,
        max: 1,
        points: 1,
      },
      {
        min: 1,
        max: 2,
        points: 2,
      },
      {
        min: 2,
        max: 3,
        points: 3,
      },
      {
        min: 3,
        max: 4,
        points: 4,
      },
      {
        min: 5,
        points: 5,
      },
    ],
    weight: 0.3,
  },
  monetary: {
    rules: [
      {
        min: 0,
        max: 80,
        points: 0,
      },
      {
        min: 81,
        max: 199,
        points: 1,
      },
      {
        min: 200,
        max: 399,
        points: 2,
      },
      {
        min: 400,
        max: 599,
        points: 3,
      },
      {
        min: 600,
        max: 799,
        points: 4,
      },
      {
        min: 800,
        points: 5,
      },
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
    rank: "PREMIUM",
    priority: 100,
    minRecency: 3,
    maxRecency: 5,
    minFrequency: 3,
    maxFrequency: 5,
    minMonetary: 5,
    maxMonetary: 5,
  },
  {
    rank: "VIP",
    priority: 90,
    minRecency: 3,
    maxRecency: 5,
    minFrequency: 3,
    maxFrequency: 5,
    minMonetary: 3,
    maxMonetary: 4,
  },
  {
    rank: "SUPERIOR LUSSO",
    priority: 80,
    minRecency: 2,
    maxRecency: 3,
    minFrequency: 1,
    maxFrequency: 2,
    minMonetary: 4,
    maxMonetary: 5,
  },
  {
    rank: "OCCASIONALE",
    priority: 70,
    minRecency: 2,
    maxRecency: 5,
    minFrequency: 2,
    maxFrequency: 3,
    minMonetary: 2,
    maxMonetary: 3,
  },
  {
    rank: "BASE-NUOVO",
    priority: 60,
    minRecency: 1,
    maxRecency: 5,
    minFrequency: 1,
    maxFrequency: 1,
    minMonetary: 1,
    maxMonetary: 2,
  },
  {
    rank: "PASSIVI",
    priority: 50,
    minRecency: 0,
    maxRecency: 0,
    minFrequency: 0,
    maxFrequency: 2,
    minMonetary: 0,
    maxMonetary: 2,
  },
];

export const DEFAULT_RFM_CONFIG: RFMConfig = {
  rules: DEFAULT_RULES,
  ranks: DEFAULT_RANKS,
};
