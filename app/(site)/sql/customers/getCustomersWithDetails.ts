import { CustomerWithDetails } from "@/app/(site)/models";
import prisma from "../db";
import { homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../functions/product-management/filterInactiveProducts";

export default async function getCustomersWithDetails(): Promise<CustomerWithDetails[]> {
  const customers = await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
    },
  });

  return customers.map(filterInactiveProducts);
}
