import { Address } from "@/prisma/generated/zod";
import prisma from "../db";
import getCustomerWithDetails from "./getCustomerWithDetails";
import { CustomerWithDetails } from "../../models";

export default async function updateAddressesOfCustomer(
  addresses: Address[],
  customerId: number
): Promise<CustomerWithDetails | null> {
  await prisma.$transaction(async (tx) => {
    const updatePromises = addresses
      .filter((address) => address.id > 0)
      .map((address) =>
        tx.address.update({
          where: { id: address.id },
          data: {
            street: address.street,
            civic: address.civic,
            floor: address.floor,
            stair: address.stair,
            street_info: address.street_info,
            temporary: address.temporary,
            doorbell: address.doorbell.toLocaleLowerCase(),
            active: address.active,
          },
        })
      );

    const createPromises = addresses
      .filter((address) => address.id <= 0)
      .map((address) =>
        tx.address.create({
          data: {
            customer_id: customerId,
            street: address.street,
            civic: address.civic,
            floor: address.floor,
            stair: address.stair,
            street_info: address.street_info,
            temporary: address.temporary,
            doorbell: address.doorbell.toLocaleLowerCase(),
            active: address.active,
          },
        })
      );

    await Promise.all([...updatePromises, ...createPromises]);
  });

  return getCustomerWithDetails(customerId);
}
