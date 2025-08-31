import { AddressContract } from "../../shared";
import getCustomerByPhone from "../customers/getCustomerByPhone";
import prisma from "../db";

export default async function getLastAddressOfCustomer({
  phone,
}: AddressContract["Requests"]["GetLastAddressOfCustomer"]): Promise<number | null> {
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
