import { EngagementTemplate } from "@prisma/client";
import prisma from "../../db";
import normalizeTemplatePayload from "@/app/(site)/lib/services/engagement/normalizeTemplatePayload";

export default async function getEngagementTemplates(): Promise<EngagementTemplate[]> {
  const templates = await prisma.engagementTemplate.findMany({});
  return templates.map(normalizeTemplatePayload);
}
