import { CustomerWithDetails } from "../../models";
import prisma from "../db";
import getCustomerWithDetails from "./getCustomerWithDetails";

export default async function getCustomersByDoorbell(
  doorbell: string
): Promise<CustomerWithDetails[]> {
  // Fetch customer IDs based on doorbell
  const customersId = await prisma.customer.findMany({
    where: {
      addresses: {
        some: {
          doorbell: {
            contains: doorbell,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      },
    },
    select: { id: true },
  });

  // Use Promise.all to handle asynchronous calls and filter out null values
  const customers = await Promise.all(
    customersId.map(async (customer) => await getCustomerWithDetails(customer.id))
  ).then((results) => results.filter((customer) => customer !== null));

  return customers;
}
