import { Address } from "@/prisma/generated/zod";
import prisma from "../db";
import getCustomerWithDetails from "./getCustomerWithDetails";
import { CustomerWithDetails } from "../../models";

export default async function updateAddressesOfCustomer(
  addresses: Address[],
  customerId: number
): Promise<CustomerWithDetails | null> {
  for (const address of addresses) {
    if (address.id > 0) {
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
      await prisma.address.create({
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
      });
    }
  }

  return getCustomerWithDetails(customerId);
}
