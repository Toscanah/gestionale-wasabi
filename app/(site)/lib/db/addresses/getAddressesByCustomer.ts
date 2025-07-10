import { Address } from "@prisma/client";
import prisma from "../db";

export default async function getAddressesByCustomer({
  customerId,
}: {
  customerId: number;
}): Promise<Address[]> {
  return await prisma.address.findMany({
    where: {
      customer: {
        id: customerId,
      },
      temporary: false,
    },
  });
}
