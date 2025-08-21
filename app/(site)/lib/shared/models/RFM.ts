import { z } from "zod";

export const RFMDimensionSchema = z.enum(["recency", "frequency", "monetary"]);

export const RFMRangeRuleSchema = z.object({
  min: z.number(),
  max: z.number().optional(),
  points: z.number(),
});

export const RFMDimensionConfigSchema = z.object({
  rules: z.array(RFMRangeRuleSchema),
  weight: z.number(),
});

export const RFMSRuleschema = z.object({
  recency: RFMDimensionConfigSchema,
  frequency: RFMDimensionConfigSchema,
  monetary: RFMDimensionConfigSchema,
});

export const RFMScoreSchema = z.object({
  recency: z.number(),
  frequency: z.number(),
  monetary: z.number(),
  finalScore: z.number(),
});

// ----------------------------------------------------

export const RFMRank = z.string()

export const RFMRankRuleSchema = z.object({
  rank: RFMRank,
  // optional conditions to define the category
  minRecency: z.number().optional(),
  maxRecency: z.number().optional(),
  minFrequency: z.number().optional(),
  maxFrequency: z.number().optional(),
  minMonetary: z.number().optional(),
  maxMonetary: z.number().optional(),
});

// Configurable set of category rules
export const RFMRankConfigSchema = z.array(RFMRankRuleSchema);

// Example result after classification
export const RFMCustomerSegmentSchema = z.object({
  score: RFMScoreSchema,
  rank: RFMRank,
});

export const RFMConfigSchema = z.object({
  rules: RFMSRuleschema,
  ranks: RFMRankConfigSchema,
});