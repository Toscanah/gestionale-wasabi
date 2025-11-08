import { CustomerContracts } from "@/app/(site)/lib/shared";
import prisma from "../prisma";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";

/**
 * Retrieves a customer by ID along with related details such as addresses, phone, orders, and engagements.
 *
 * @param {CustomerContracts.GetComprehensive.Input} params - The input object containing the customer ID.
 * @returns {Promise<CustomerContracts.GetComprehensive.Output>} The customer details with related entities, or `null` if not found.
 */
export default async function getComprehensiveCustomer({
  customerId,
}: CustomerContracts.GetComprehensive.Input): Promise<CustomerContracts.GetComprehensive.Output> {
  const customer = await prisma.customer.findUnique({
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

  if (!customer) {
    throw new Error("Customer not found");
  }

  return filterInactiveProducts(customer);
}
