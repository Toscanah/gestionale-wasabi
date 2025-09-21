import prisma from "../../db";
import normalizeTemplatePayload from "@/app/(site)/lib/services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "../../../shared";

export default async function getEngagementTemplates(
  input: EngagementContracts.GetTemplates.Input
): Promise<EngagementContracts.GetTemplates.Output> {
  const templates = await prisma.engagementTemplate.findMany();
  return templates.map(normalizeTemplatePayload);
}
