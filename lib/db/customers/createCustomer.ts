import prisma from "../prisma";
import { CustomerContracts } from "@/lib/shared";
import getComprehensiveCustomer from "./getComprehensiveCustomer";
import { TRPCError } from "@trpc/server";

export default async function createCustomer({
  customer,
}: CustomerContracts.Create.Input): Promise<CustomerContracts.Create.Output> {
  const createdCustomer = await prisma.$transaction(async (tx) => {
    const { phone, ...customerData } = customer;

    const phoneExists = await tx.phone.findUnique({
      where: { phone },
    });

    if (phoneExists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A customer with this phone number already exists.",
      });
    }

    const newPhone = await tx.phone.create({
      data: { phone },
    });

    return await tx.customer.create({
      data: {
        ...customerData,
        phone_id: newPhone.id,
      },
    });
  });

  return await getComprehensiveCustomer({ customerId: createdCustomer.id });
}
