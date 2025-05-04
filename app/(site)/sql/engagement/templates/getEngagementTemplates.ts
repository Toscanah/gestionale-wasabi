import prisma from "../../db";

export default async function getEngagementTemplates() {
  return await prisma.engagementTemplate.findMany({});
}
