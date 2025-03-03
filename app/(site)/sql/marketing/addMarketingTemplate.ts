import { MarketingTemplate } from "@prisma/client";
import { MarketingTemplateInput } from "../../models";
import prisma from "../db";

export default async function addMarketingTemplate(
  marketingTemplate: MarketingTemplateInput
): Promise<MarketingTemplate | null> {
  const existingTemplate = await prisma.marketingTemplate.findUnique({
    where: { label: marketingTemplate.label },
  });

  if (existingTemplate) {
    return null;
  }

  return await prisma.marketingTemplate.create({
    data: {
      ...marketingTemplate,
    },
  });
}
