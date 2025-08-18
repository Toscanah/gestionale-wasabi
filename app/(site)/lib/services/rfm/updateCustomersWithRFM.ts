import { CustomerWithStats } from "../../shared";
import { RFMRankRule, RFMRules } from "../../shared/types/RFM";
import calculateRfmCategory from "./calculateRfmCategory";
import { calculateRfmScore } from "./calculateRfmScore";

export default function updateCustomersWithRFM(
  customers: CustomerWithStats[],
  rfmRules: RFMRules,
  rankRules: RFMRankRule[]
): CustomerWithStats[] {
  return customers.map((customer) => {
    const { frequency, monetary, recency } = customer.rfm.score;

    const rfmScore = calculateRfmScore({ frequency, monetary, recency }, rfmRules);
    const rfmCategory = calculateRfmCategory(rfmScore, rankRules);

    return {
      ...customer,
      rfm: {
        ...customer.rfm,
        score: rfmScore,
        category: rfmCategory,
      },
    };
  });
}
