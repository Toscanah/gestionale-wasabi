import { OrderType } from "@prisma/client";
import prisma from "../db";
import { AnyOrder } from "../../models";

export default async function createPickupOrder(
  name: string,
  when: string,
  phone?: string
): Promise<{ order: AnyOrder; isNewOrder: boolean }> {
  let orderName = name;
  let customerData = undefined;

  const existingOrder = await prisma.order.findFirst({
    where: {
      type: OrderType.PICKUP,
      pickup_order: {
        name,
      },
      state: "ACTIVE",
    },
    include: {
      payments: true,
      pickup_order: {
        include: {
          customer: {
            include: {
              phone: true,
            },
          },
        },
      },
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  });

  if (existingOrder) {
    return { order: existingOrder, isNewOrder: false };
  }

  if (phone) {
    const existingPhone = await prisma.phone.findFirst({
      where: { phone: phone },
      include: { customer: true },
    });

    if (existingPhone) {
      const customer = existingPhone.customer;

      if (customer) {
        customerData = {
          connect: {
            id: customer.id,
          },
        };

        orderName = customer.surname ?? name;
      }
    } else {
      // Phone does not exist, create new customer and phone
      customerData = {
        create: {
          name: name,
          surname: "",
          phone: {
            create: { phone: phone },
          },
        },
      };
    }
  }

  // Create the order with or without customer data
  const createdOrder = await prisma.order.create({
    data: {
      type: OrderType.PICKUP,
      total: 0,
      pickup_order: {
        create: {
          name: name,
          when: when,
          customer: customerData,
        },
      },
    },
    include: {
      payments: true,
      pickup_order: {
        include: {
          customer: {
            include: {
              phone: true,
            },
          },
        },
      },
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  });

  return { order: createdOrder, isNewOrder: true };
}
