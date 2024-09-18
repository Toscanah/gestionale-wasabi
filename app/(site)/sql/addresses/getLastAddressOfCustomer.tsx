import getCustomerByPhone from "../customers/getCustomerByPhone";
import prisma from "../db";

export default async function getLastAddressOfCustomer(phone: string) {
  const customer = await getCustomerByPhone(phone);

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
    include: {
      home_order: true,
    },
  });

  //console.log(lastOrderWithAddress)

  if (lastOrderWithAddress && lastOrderWithAddress.home_order) {
    return lastOrderWithAddress;
  }

  return null;
}
