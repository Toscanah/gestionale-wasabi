import { Address } from "@prisma/client";
import prisma from "../db";
import getCustomersWithDetails from "./getCustomersWithDetails";

export default async function updateAddressesOfCustomer(addresses: Address[], customerId: number) {
  for (const address of addresses) {
    if (address.id >= 0) {
      // Update the existing address if it exists
      await prisma.address.update({
        where: { id: address.id },
        data: {
          street: address.street,
          civic: address.civic,
          floor: address.floor,
          stair: address.stair,
          street_info: address.street_info,
          temporary: address.temporary,
          doorbell: address.doorbell,
          active: address.active,
        },
      });
    } else {
      // Create a new address if it doesn't exist
      await prisma.address.create({
        data: {
          customer_id: customerId,
          street: address.street,
          civic: address.civic,
          floor: address.floor,
          stair: address.stair,
          street_info: address.street_info,
          temporary: address.temporary,
          doorbell: address.doorbell,
          active: address.active,
        },
      });
    }
  }

  return getCustomersWithDetails();
}
