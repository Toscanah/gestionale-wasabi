import { AddressContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function updateAddress({
  address,
}: AddressContracts.Update.Input): Promise<AddressContracts.Update.Output> {
  return await prisma.address.update({
    data: {
      civic: address.civic,
      doorbell: address.doorbell,
      floor: address.floor,
      stair: address.stair,
      street: address.street,
      street_info: address.street_info,
      temporary: address.temporary,

      active: address.active,
      ...(address.customer_id && {
        customer: {
          connect: {
            id: address.customer_id,
          },
        },
      }),
    },
    where: {
      id: address.id,
    },
  });
}
