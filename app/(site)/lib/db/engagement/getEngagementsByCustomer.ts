import normalizeTemplatePayload from "../../formatting-parsing/engagement/normalizeTemplatePayload";
import { EngagementSchemaInputs, EngagementWithDetails } from "../../shared";
import prisma from "../db";

export default async function getEngagementsByCustomer({
  customerId,
}: EngagementSchemaInputs["GetEngagementsByCustomerInput"]): Promise<EngagementWithDetails[]> {
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
