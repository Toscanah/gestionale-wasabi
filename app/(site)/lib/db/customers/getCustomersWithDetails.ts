import { CustomerContract, CustomerWithDetails } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";
import buildCustomerWhere from "./util/buildCustomerWhere";

export default async function getCustomersWithDetails(
  { page, pageSize, filters }: CustomerContract["Requests"]["GetCustomersWithDetails"] = {
    page: undefined,
    pageSize: undefined,
    filters: undefined,
  }
): Promise<CustomerWithDetails[]> {
  const customers: CustomerWithDetails[] = await prisma.customer.findMany({
    skip: page !== undefined && pageSize !== undefined ? page * pageSize : undefined,
    take: pageSize,
    where: buildCustomerWhere(filters),
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
      ...engagementsInclude,
    },
  });

  return customers.map(filterInactiveProducts);
}
