import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import prisma from "../db";
import getCustomerWithDetails from "./getCustomerWithDetails";

/**
 * Retrieves a list of customers whose addresses contain the specified doorbell string.
 *
 * This function searches for customers in the database whose addresses have a doorbell field
 * that contains the provided `doorbell` substring (case-insensitive). For each matching customer,
 * it fetches detailed customer information using `getCustomerWithDetails`.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.doorbell - The doorbell substring to search for in customer addresses.
 * @returns {Promise<CustomerWithDetails[]>} A promise that resolves to an array of customers with detailed information.
 */
export default async function getCustomersByDoorbell({
  doorbell,
}: {
  doorbell: string;
}): Promise<CustomerWithDetails[]> {
  const customersId = await prisma.customer.findMany({
    where: {
      addresses: {
        some: {
          doorbell: {
            contains: doorbell,
            mode: "insensitive",
          },
        },
      },
    },
    select: { id: true },
  });

  const customers = await Promise.all(
    customersId.map(async (customer) => await getCustomerWithDetails({ customerId: customer.id }))
  ).then((results) => results.filter((customer) => customer !== null));

  return customers;
}
