import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function createCustomer(customer: Customer & { phone: string }) {
  const { phone, ...customerData } = customer;

  console.log(customer);

  const newPhone = await prisma.phone.create({
    data: { phone },
  });

  console.log(newPhone);

  return await prisma.customer.create({
    data: {
      ...customerData,
      phone_id: newPhone.id,
    },
    include: {
      phone: {
        select: {
          phone: true,
        },
      },
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
                            select: {
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
                            select: {
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
          },
        },
      },
    },
  });
}
