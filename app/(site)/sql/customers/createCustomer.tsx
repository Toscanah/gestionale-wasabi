import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function createCustomer(customer: Customer, phone: string) {
  const newPhone = await prisma.phone.create({
    data: { phone },
  });

  return await prisma.customer.create({
    data: {
      ...customer,
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
