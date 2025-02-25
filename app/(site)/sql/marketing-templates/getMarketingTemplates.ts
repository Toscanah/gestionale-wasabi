import prisma from "../db";

export default async function getMarketingTemplates() {
  return await prisma.marketingTemplate.findMany();
}

