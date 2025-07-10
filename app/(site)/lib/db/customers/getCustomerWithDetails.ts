import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import { HomeOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";

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
