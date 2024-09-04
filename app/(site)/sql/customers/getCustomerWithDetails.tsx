import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import prisma from "../db";

export default async function getCustomerWithDetails(
  customerId: number
): Promise<CustomerWithDetails | null> {
  return await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      addresses: true,
      phone: true,
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
