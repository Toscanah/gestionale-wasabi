import { Prisma } from "@prisma/client";

export type TableOrder = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    table_order: {
      include: {
        table: true;
      };
    };
    products: {
      include: { product: true };
    };
  };
}>;

export type HomeOrder = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    home_order: {
      include: {
        customer: true;
        address: true;
      };
    };
    products: {
      include: { product: true };
    };
  };
}>;

export type PickupOrder = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    pickup_order: {
      include: {
        customer: true;
      };
    };
    products: {
      include: { product: true };
    };
  };
}>;

export type BaseOrder = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    home_order: true;
    pickup_order: true;
    table_order: true;
    products: {
      include: {
        product: {
          include: {
            options: {
              include: {
                option: true;
              };
            };
            category: {
              include: {
                options: {
                  include: {
                    option: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type AnyOrder = HomeOrder | PickupOrder | TableOrder;
