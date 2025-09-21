import prisma from "../db";
import { CustomerContracts } from "@/app/(site)/lib/shared";

export default async function createCustomer({
  customer,
}: CustomerContracts.Create.Input): Promise<CustomerContracts.Create.Output> {
  return await prisma.$transaction(async (tx) => {
    const { phone, ...customerData } = customer;

    const phoneExists = await tx.phone.findUnique({
      where: { phone },
    });

    if (phoneExists) {
      throw new Error("Phone number already exists");
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
}
