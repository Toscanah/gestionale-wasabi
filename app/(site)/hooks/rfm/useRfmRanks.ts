import { useEffect, useState, useCallback } from "react";
import { RFMRankRule } from "../../lib/shared/types/rfm";
import { DEFAULT_RFM_CONFIG } from "../../lib/shared/constants/rfm-config";

export default function useRfmRanks() {
  const [ranks, setRanks] = useState<RFMRankRule[]>(DEFAULT_RFM_CONFIG.ranks);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("rfmConfig");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as typeof DEFAULT_RFM_CONFIG;
        setRanks(parsed.ranks);
      } catch {
        setRanks(DEFAULT_RFM_CONFIG.ranks);
      }
    } else {
      localStorage.setItem(
        "rfmConfig",
        JSON.stringify({
          rules: DEFAULT_RFM_CONFIG.rules,
          ranks: DEFAULT_RFM_CONFIG.ranks,
        })
      );
      setRanks(DEFAULT_RFM_CONFIG.ranks);
    }
  }, []);

  const save = useCallback((newRanks: RFMRankRule[]) => {
    setRanks(newRanks);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rfmConfig");
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "rfmConfig",
        JSON.stringify({ ...parsed, ranks: newRanks })
      );
    }
  }, []);

  const updateRankRule = (index: number, updatedRule: RFMRankRule) => {
    const newRanks = [...ranks];
    newRanks[index] = updatedRule;
    save(newRanks);
  };

  const addRankRule = (rule: RFMRankRule) => {
    const newRanks = [...ranks, rule];
    save(newRanks);
  };

  const removeRankRule = (index: number) => {
    save(ranks.filter((_, i) => i !== index));
  };

  const resetRanks = () => save(DEFAULT_RFM_CONFIG.ranks);

  return {
    ranks,
    updateRankRule,
    addRankRule,
    removeRankRule,
    resetRanks,
  };
}
