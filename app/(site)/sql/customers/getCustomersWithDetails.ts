import { CustomerWithDetails } from "@/app/(site)/models";
import prisma from "../db";

export default async function getCustomersWithDetails(): Promise<CustomerWithDetails[]> {
  const customers = await prisma.customer.findMany({
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

  // Filter out inactive products
  customers.forEach((customer) => {
    customer.home_orders.forEach((homeOrder) => {
      homeOrder.order.products = homeOrder.order.products.filter(
        (productInOrder) => productInOrder.product.active
      );
    });

    customer.pickup_orders.forEach((pickupOrder) => {
      pickupOrder.order.products = pickupOrder.order.products.filter(
        (productInOrder) => productInOrder.product.active
      );
    });
  });

  return customers;
}
