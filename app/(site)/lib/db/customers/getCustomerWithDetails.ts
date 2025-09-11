import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import { HomeOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";

/**
 * Retrieves a customer by ID along with related details such as addresses, phone, home and pickup orders, and engagements.
 * Applies filtering to exclude inactive products from the returned customer data.
 *
 * @param params - An object containing the customer ID.
 * @param params.customerId - The unique identifier of the customer to retrieve.
 * @returns A promise that resolves to the customer with detailed information, or `null` if the customer is not found.
 */
export default async function getCustomerWithDetails({
  customerId,
}: {
  customerId: number;
}): Promise<CustomerWithDetails> {
  const customer: CustomerWithDetails = await prisma.customer.findUniqueOrThrow({
    where: {
      id: customerId,
    },
    include: {
      addresses: true,
      phone: true,
      ...homeAndPickupOrdersInclude,
      ...engagementsInclude,
    },
  });

  return filterInactiveProducts(customer);
}
