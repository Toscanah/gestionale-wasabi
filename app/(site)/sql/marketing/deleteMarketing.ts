import { MarketingOnCustomer } from "../../models";
import prisma from "../db";

export default async function deleteMarketing(marketing: MarketingOnCustomer) {
  return await prisma.marketingOnCustomer.delete({
    where: {
      id: marketing.id,
    },
  });
}
