import { AddressContracts } from "@/lib/shared";
import getCustomerByPhone from "../customers/getCustomerByPhone";
import prisma from "../prisma";

export default async function getLastAddressIdOfCustomer({
  phone,
}: AddressContracts.GetLastIdOfCustomer.Input): Promise<AddressContracts.GetLastIdOfCustomer.Output> {
  const customer = await getCustomerByPhone({ phone });

  if (!customer) {
    return null;
  }

  const lastOrderWithAddress = await prisma.order.findFirst({
    where: {
      home_order: {
        customer_id: customer.id,
        address: {
          temporary: false,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      home_order: {
        select: {
          address_id: true,
        },
      },
    },
  });

  if (lastOrderWithAddress && lastOrderWithAddress.home_order) {
    return lastOrderWithAddress.home_order.address_id;
  }

  return null;
}
