export type RFMRulePoints = 0 | 1 | 2 | 3 | 4 | 5;

export type RFMRangeRule = {
  min: number;
  max?: number;
  points: RFMRulePoints;
};

export type RFMDimension = "recency" | "frequency" | "monetary";

export type RFMDimensionConfig = {
  rules: RFMRangeRule[];
  weight: number;
};

export type RFM = {
  [key in RFMDimension]: RFMDimensionConfig;
};