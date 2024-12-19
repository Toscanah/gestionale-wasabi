import { Customer } from "@prisma/client";
import { CustomerWithDetails } from "../../models";
import prisma from "../db";

export default async function updateCustomerFromAdmin(
  customer: Customer & { phone: string | null }
): Promise<CustomerWithDetails> {
  let phoneId = customer.phone_id ?? null;
  const { phone, ...customerData } = customer;

  if (phone) {
    // Update existing phone or create a new one
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
  } else {
    // Disconnect phone if no phone is provided
    phoneId = null;
  }

  return await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: customerData.name,
      surname: customerData.surname,
      email: customerData.email,
      preferences: customerData.preferences,
      phone: phoneId ? { connect: { id: phoneId } } : { disconnect: true }, // Handle connect or disconnect
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
                            include: { option: true },
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
                            include: { option: true },
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
