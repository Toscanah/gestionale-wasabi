import { OrderType } from "@prisma/client";
import prisma from "../db";

export default async function createPickupOrder(name: string, when: string, phone?: string) {
  let orderName = name;
  let customerData = undefined;

  if (phone) {
    const existingPhone = await prisma.phone.findFirst({
      where: { phone: phone },
      include: { customer: true },
    });

    // Phone exists, connect the existing customer
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

  return createdOrder;
}
