import normalizeTemplatePayload from "../../services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "../../shared";
import prisma from "../prisma";

export default async function getEngagementsByCustomer({
  customerId,
}: EngagementContracts.GetByCustomer.Input): Promise<EngagementContracts.GetByCustomer.Output> {
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
