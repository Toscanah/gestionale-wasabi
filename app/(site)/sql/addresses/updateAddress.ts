import prisma from "../db";
import { UpdateAddressInput } from "@shared";

export default async function updateAddress({ address }: { address: UpdateAddressInput }) {
  return await prisma.address.update({
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
    where: {
      id: address.id,
    },
  });
}
