import { Customer } from "@prisma/client";
import { CustomerWithDetails } from "../../models";
import prisma from "../db";

export default async function updateCustomerFromAdmin(
  customer: Customer & { phone: string }
): Promise<CustomerWithDetails> {
  let phoneId = customer.phone_id ?? null;
  const { phone, ...customerData } = customer;

  if (phoneId) {
    await prisma.phone.update({
      where: { id: phoneId },
      data: { phone },
    });
  } else {
    const newPhone = await prisma.phone.create({
      data: { phone },
    });
    phoneId = newPhone.id;
  }

  return await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: customerData.name,
      surname: customerData.surname,
      email: customerData.email,
      preferences: customerData.preferences,
      phone_id: phoneId,
    },
    include: {
      phone: true,
      addresses: true,
      home_orders: {
        include: {
          order: {
            include: {
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
                  options: { include: { option: true } },
                },
              },
            },
          },
        },
      },
      pickup_orders: {
        include: {
          order: {
            include: {
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
                  options: { include: { option: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}
