import { CustomerWithDetails } from "@shared";
import { HomeOrder } from "@shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../lib/product-management/filterInactiveProducts";

export default async function getCustomerWithDetails({
  customerId,
}: {
  customerId: number;
}): Promise<CustomerWithDetails | null> {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
      ...engagementsInclude
    },
  });

  if (!customer) return null;

  return filterInactiveProducts(customer);
}
