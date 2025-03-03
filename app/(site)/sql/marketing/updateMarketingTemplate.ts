import { MarketingTemplate } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function updateMarketingTemplate(
  marketing: MarketingTemplate
): Promise<MarketingTemplate | null> {
  const existingMarketingTemplate = await prisma.marketingTemplate.findUnique({
    where: {
      id: marketing.id,
    },
  });

  if (!existingMarketingTemplate) {
    return null;
  }

  return prisma.marketingTemplate.update({
    where: {
      id: marketing.id,
    },
    data: {
      ...marketing,
    },
  });
}
