import { CustomerWithStats } from "../../shared";
import { RFMRankRule, RFMRules } from "../../shared/types/RFM";
import { calculateRfmRank } from "./calculateRfmRank";
import { calculateRfmScore } from "./calculateRfmScore";

export default function updateCustomersWithRFM(
  customers: CustomerWithStats[],
  rfmRules: RFMRules,
  rankRules: RFMRankRule[]
): CustomerWithStats[] {
  const unrankedStats: {
    total: number;
    recency: number[];
    frequency: number[];
    monetary: number[];
  } = { total: 0, recency: [], frequency: [], monetary: [] };

  const updated = customers.map((customer) => {
    const { frequency, monetary, recency } = customer.rfm.score;

    const rfmScore = calculateRfmScore({ frequency, monetary, recency }, rfmRules);
    const rfmRank = calculateRfmRank(rfmScore, rankRules);

    if (!rfmRank) {
      unrankedStats.total++;
      unrankedStats.recency.push(rfmScore.recency);
      unrankedStats.frequency.push(rfmScore.frequency);
      unrankedStats.monetary.push(rfmScore.monetary);

      console.log("❌ Unranked customer:", {
        id: customer.id,
        phone: customer.phone.phone,
        score: rfmScore,
      });
    }

    return {
      ...customer,
      rfm: {
        score: {
          ...rfmScore,
        },
        rank: rfmRank ?? "",
      },
    } as CustomerWithStats;
  });

  if (unrankedStats.total > 0) {
    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    console.log("⚠️ Unranked Customers Stats:", {
      count: unrankedStats.total,
      avgRecency: avg(unrankedStats.recency).toFixed(2),
      avgFrequency: avg(unrankedStats.frequency).toFixed(2),
      avgMonetary: avg(unrankedStats.monetary).toFixed(2),
      examples: unrankedStats.total > 5
        ? unrankedStats.recency.slice(0, 5).map((_, i) => ({
            recency: unrankedStats.recency[i],
            frequency: unrankedStats.frequency[i],
            monetary: unrankedStats.monetary[i],
          }))
        : unrankedStats.recency.map((_, i) => ({
            recency: unrankedStats.recency[i],
            frequency: unrankedStats.frequency[i],
            monetary: unrankedStats.monetary[i],
          })),
    });
  }

  return updated;
}
