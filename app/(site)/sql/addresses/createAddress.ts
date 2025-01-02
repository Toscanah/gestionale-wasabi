import { Address } from "@prisma/client";
import prisma from "../db";

export default async function createAddress(address: Address) {
  return await prisma.address.create({
    data: {
      civic: address.civic,
      doorbell: address.doorbell,
      floor: address.floor,
      stair: address.stair,
      street: address.street,
      street_info: address.street_info,
      temporary: address.temporary,
      customer: {
        connect: {
          id: address.customer_id,
        },
      },
    },
  });
}
