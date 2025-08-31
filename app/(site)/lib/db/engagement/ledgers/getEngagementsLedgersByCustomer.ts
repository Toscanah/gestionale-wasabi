import { EngagementLedgerWithDetails, EngagementContract } from "../../../shared";
import prisma from "../../db";

export default async function getEngagementsLedgersByCustomer({
  customerId,
}: EngagementContract["Requests"]["GetEngagementsLedgersByCustomer"]): Promise<
  EngagementLedgerWithDetails[]
> {
  return await prisma.engagementLedger.findMany({
    where: {
      engagement: {
        customer_id: customerId, // filter by the customer
      },
    },
    include: {
      engagement: {
        include: {
          template: true, // to display template label/type
        },
      },
    },
    orderBy: { issued_at: "desc" },
  });
}
