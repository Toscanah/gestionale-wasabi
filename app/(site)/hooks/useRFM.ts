import { useEffect, useState } from "react";
import { RFM, RFMRangeRule } from "../lib/shared/types/RFM";

export const DEFAULT_RFM_RULES: RFM = {
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
      { min: 155, max: 299, points: 2 },
      { min: 300, max: 499, points: 3 },
      { min: 500, max: 799, points: 4 },
      { min: 800, points: 5 },
    ],
    weight: 0.2,
  },
};

export default function useRFM() {
  const [rfmRules, setRfmRules] = useState<RFM>(DEFAULT_RFM_RULES);

  const saveRfmRulesToLocalStorage = (newRules: RFM) => {
    setRfmRules(newRules);
    localStorage.setItem("rfmRules", JSON.stringify(newRules));
  };

  const getRfmRules = () => {
    const stored = localStorage.getItem("rfmRules");
    saveRfmRulesToLocalStorage(
      stored ? { ...DEFAULT_RFM_RULES, ...(JSON.parse(stored) as RFM) } : DEFAULT_RFM_RULES
    );
  };

  const updateDimensionRule = (dimension: keyof RFM, index: number, updatedRule: RFMRangeRule) => {
    const newRules = [...rfmRules[dimension].rules];
    newRules[index] = updatedRule;
    updateDimensionRules(dimension, newRules);
  };

  const updateDimensionRules = (dimension: keyof RFM, newRules: RFMRangeRule[]) => {
    saveRfmRulesToLocalStorage({
      ...rfmRules,
      [dimension]: { ...rfmRules[dimension], rules: newRules },
    });
  };

  const updateWeight = (dimension: keyof RFM, newWeight: number) => {
    saveRfmRulesToLocalStorage({
      ...rfmRules,
      [dimension]: { ...rfmRules[dimension], weight: newWeight },
    });
  };

  const resetRules = () => {
    saveRfmRulesToLocalStorage(DEFAULT_RFM_RULES);
  };

  useEffect(getRfmRules, []);

  return {
    rfmRules,
    updateDimensionRule,
    updateDimensionRules,
    updateWeight,
    resetRules,
    getRfmRules,
  };
}
