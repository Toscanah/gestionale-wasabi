import { CustomerWithMarketing } from "../../models";
import prisma from "../db";

export default async function getCustomersWithMarketing(): Promise<CustomerWithMarketing[]> {
  return await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
      marketings: {
        include: {
          marketing: true,
        },
      },
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
}
