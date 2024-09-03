import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import prisma from "../db";

export default async function getCustomersWithDetails(): Promise<CustomerWithDetails[]> {
  return await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
    },
  });
}
