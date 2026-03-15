import { CustomerContracts, ComprehensiveCustomer } from "@/lib/shared";
import prisma from "../prisma";
import getComprehensiveCustomer from "./getComprehensiveCustomer";

export default async function getCustomersByDoorbell({
  doorbell,
}: CustomerContracts.GetByDoorbell.Input): Promise<CustomerContracts.GetByDoorbell.Output> {
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
    customersId.map(async (customer) => await getComprehensiveCustomer({ customerId: customer.id }))
  ).then((results) => results.filter(Boolean) as ComprehensiveCustomer[]);

  return customers;
}
