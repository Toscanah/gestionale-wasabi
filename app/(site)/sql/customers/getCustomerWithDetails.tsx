import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import { HomeOrder } from "../../types/PrismaOrders";
import prisma from "../db";

export default async function getCustomerWithDetails(
  customerId: number
): Promise<CustomerWithDetails | null> {
  const customer = await prisma.customer.findUnique({
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

  if (!customer) return null;

  // Filter out inactive products
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

  return customer;
}
