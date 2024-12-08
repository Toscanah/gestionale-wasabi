import { Prisma } from "@prisma/client";

export type CustomerWithDetails = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
    phone: true;
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
                            option: true;
                          };
                        };
                      };
                    };
                  };
                };
                options: { include: { option: true } };
              };
            };
          };
        };
      };
    };
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
                            option: true;
                          };
                        };
                      };
                    };
                  };
                };
                options: { include: { option: true } };
              };
            };
          };
        };
      };
    };
  };
}>;
