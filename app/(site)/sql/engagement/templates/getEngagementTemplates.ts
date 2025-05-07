import { EngagementTemplate } from "@prisma/client";
import prisma from "../../db";

export default async function getEngagementTemplates(): Promise<EngagementTemplate[]> {
  return await prisma.engagementTemplate.findMany({});
}
