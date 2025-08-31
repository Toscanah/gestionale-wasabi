import normalizeTemplatePayload from "../../services/engagement/normalizeTemplatePayload";
import { EngagementContract, EngagementWithDetails } from "../../shared";
import prisma from "../db";

export default async function getEngagementsByCustomer({
  customerId,
}: EngagementContract["Requests"]["GetEngagementsByCustomer"]): Promise<EngagementWithDetails[]> {
  const engagements = await prisma.engagement.findMany({
    where: {
      customer_id: customerId,
    },
    include: {
      template: true,
    },
  });

  return engagements.map((engagement) => ({
    ...engagement,
    template: normalizeTemplatePayload(engagement.template),
  }));
}
