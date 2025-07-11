import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import prisma from "../db";
import getCustomerWithDetails from "./getCustomerWithDetails";

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
