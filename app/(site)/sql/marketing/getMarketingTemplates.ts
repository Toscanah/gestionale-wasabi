import { MarketingTemplate } from "@prisma/client";
import prisma from "../db";

export default async function getMarketingTemplates(): Promise<MarketingTemplate[]> {
  return await prisma.marketingTemplate.findMany();
}