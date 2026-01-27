import { EngagementContracts } from "@/lib/shared";
import prisma from "../../prisma";

export default async function getEngagementsLedgersByCustomer({
  customerId,
}: EngagementContracts.GetLedgersByCustomer.Input): Promise<
  EngagementContracts.GetLedgersByCustomer.Output
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
