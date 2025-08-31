import { Address } from "@prisma/client";
import prisma from "../db";
import { AddressContract } from "../../shared";

export default async function getAddressesByCustomer({
  customerId,
}: AddressContract["Requests"]["GetAddressesByCustomer"]): Promise<Address[]> {
  return await prisma.address.findMany({
    where: {
      customer: {
        id: customerId,
      },
      temporary: false,
    },
  });
}
