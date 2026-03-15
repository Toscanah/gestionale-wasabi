import prisma from "../prisma";
import { AddressContracts } from "@/lib/shared";

export default async function getAddressesByCustomer({
  customerId,
}: AddressContracts.GetByCustomer.Input): Promise<AddressContracts.GetByCustomer.Output> {
  return await prisma.address.findMany({
    where: {
      customer: {
        id: customerId,
      },
      temporary: false,
    },
  });
}
