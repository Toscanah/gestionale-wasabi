import prisma from "../db";
import { AddressContracts } from "../../shared";

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
