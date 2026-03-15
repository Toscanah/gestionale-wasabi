import { z } from "zod";
import {
  RFMRankConfigSchema,
  RFMRankRuleSchema,
  RFMConfigSchema,
  RFMCustomerSegmentSchema,
  RFMDimensionConfigSchema,
  RFMDimensionSchema,
  RFMRangeRuleSchema,
  RFMRuleschema,
  RFMScoreSchema,
} from "../models/rfm";

export type RFMRangeRule = z.infer<typeof RFMRangeRuleSchema>;

export type RFMDimension = z.infer<typeof RFMDimensionSchema>;

export type RFMDimensionConfig = z.infer<typeof RFMDimensionConfigSchema>;

export type RFMRules = z.infer<typeof RFMRuleschema>;

export type RFMScore = z.infer<typeof RFMScoreSchema>;

export type RFMRankRule = z.infer<typeof RFMRankRuleSchema>;

export type RFMRankConfig = z.infer<typeof RFMRankConfigSchema>;

export type RFMCustomerSegment = z.infer<typeof RFMCustomerSegmentSchema>;

export type RFMConfig = z.infer<typeof RFMConfigSchema>;