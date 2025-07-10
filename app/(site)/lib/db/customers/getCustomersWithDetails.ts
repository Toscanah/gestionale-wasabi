import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";

export default async function getCustomersWithDetails(): Promise<CustomerWithDetails[]> {
  const customers = await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
      ...engagementsInclude,
    },
  });

  return customers.map(filterInactiveProducts)
}
