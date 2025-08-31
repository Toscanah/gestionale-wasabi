import calculateRFM from "../../services/rfm/calculateRFM";
import { calculateRfmRank } from "../../services/rfm/calculateRfmRank";
import { calculateRfmScore } from "../../services/rfm/calculateRfmScore";
import { CustomerWithDetails } from "../../shared";
import { RFMConfig } from "../../shared/types/rfm";
import prisma from "../db";

export default async function updateCustomerRFM({
  rfmConfig,
  customer,
  dateFilteredOrdersCount,
  lastOrderDateLifetime,
  averageSpendingFiltered,
}: {
  rfmConfig: RFMConfig;
  customer: CustomerWithDetails;
  dateFilteredOrdersCount: number;
  lastOrderDateLifetime: Date | undefined;
  averageSpendingFiltered: number;
}) {
  const { ranks, rules } = rfmConfig;
  const { frequency, monetary, recency } = calculateRFM(
    dateFilteredOrdersCount,
    lastOrderDateLifetime,
    averageSpendingFiltered
  );

  const score = calculateRfmScore({ frequency, monetary, recency }, rules);
  const rank = calculateRfmRank(score, ranks) ?? "";

  return prisma.customer.update({
    where: { id: customer.id },
    data: {
      rfm: {
        rank,
        score,
      },
    },
    select: {
      rfm: true,
    },
  });
}
