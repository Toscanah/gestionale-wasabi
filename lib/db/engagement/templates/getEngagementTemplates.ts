import prisma from "../../prisma";
import normalizeTemplatePayload from "@/lib/services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "@/lib/shared";

export default async function getEngagementTemplates(
  input: EngagementContracts.GetTemplates.Input
): Promise<EngagementContracts.GetTemplates.Output> {
  const templates = await prisma.engagementTemplate.findMany();
  return templates.map(normalizeTemplatePayload);
}
