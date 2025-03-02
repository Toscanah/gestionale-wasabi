import { CustomerWithDetails } from "@/app/(site)/models";
import { HomeOrder } from "@/app/(site)/models";
import prisma from "../db";
import { homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../functions/product-management/filterInactiveProducts";

export default async function getCustomerWithDetails(
  customerId: number
): Promise<CustomerWithDetails | null> {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
    },
  });

  if (!customer) return null;

  return filterInactiveProducts(customer);
}
