import { useEffect, useState, useCallback } from "react";
import { RFMRules, RFMRangeRule, DEFAULT_RFM_CONFIG } from "@/lib/shared";

export default function useRfmRules() {
  const [rules, setRules] = useState<RFMRules>(DEFAULT_RFM_CONFIG.rules);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("rfmConfig");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as typeof DEFAULT_RFM_CONFIG;
        setRules(parsed.rules);
      } catch {
        setRules(DEFAULT_RFM_CONFIG.rules);
      }
    } else {
      localStorage.setItem(
        "rfmConfig",
        JSON.stringify({ rules: DEFAULT_RFM_CONFIG.rules, ranks: DEFAULT_RFM_CONFIG.ranks }),
      );
      setRules(DEFAULT_RFM_CONFIG.rules);
    }
  }, []);

  const save = useCallback((newRules: RFMRules) => {
    setRules(newRules);

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rfmConfig");
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem("rfmConfig", JSON.stringify({ ...parsed, rules: newRules }));
    }
  }, []);

  const updateDimensionRule = (
    dimension: keyof RFMRules,
    index: number,
    updatedRule: RFMRangeRule,
  ) => {
    const newRules = [...rules[dimension].rules];
    newRules[index] = updatedRule;
    save({ ...rules, [dimension]: { ...rules[dimension], rules: newRules } });
  };

  const updateDimensionRules = (dimension: keyof RFMRules, newRules: RFMRangeRule[]) => {
    save({
      ...rules,
      [dimension]: { ...rules[dimension], rules: newRules },
    });
  };

  const updateWeight = (dimension: keyof RFMRules, newWeight: number) =>
    save({ ...rules, [dimension]: { ...rules[dimension], weight: newWeight } });

  const resetRules = () => save(DEFAULT_RFM_CONFIG.rules);

  return { rfmRules: rules, updateDimensionRule, updateWeight, resetRules, updateDimensionRules };
}
