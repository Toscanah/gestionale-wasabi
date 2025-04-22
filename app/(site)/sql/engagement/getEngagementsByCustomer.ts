import { GetEngagementsByCustomer as GetEngagementsByCustomerParams } from "../../shared";
import prisma from "../db";

export default async function getEngagementsByCustomer({
  customerId,
}: GetEngagementsByCustomerParams) {
  return await prisma.engagement.findMany({
    where: {
      customer_id: customerId,
    },
  });
}
