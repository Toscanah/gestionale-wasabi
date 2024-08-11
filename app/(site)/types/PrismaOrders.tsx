import { Prisma } from "@prisma/client";

type CommonOrderPayload = Prisma.OrderGetPayload<{
  include: {
    payments: true;

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
        options: {
          select: {
            option: true;
          };
        };
      };
    };
  };
}>;

type TableOrderPayload = Prisma.OrderGetPayload<{
  include: {
    table_order: {
      include: {
        table: true;
      };
    };
  };
}>;

type HomeOrderPayload = Prisma.OrderGetPayload<{
  include: {
    home_order: {
      include: {
        customer: true;
        address: true;
      };
    };
  };
}>;

type PickupOrderPayload = Prisma.OrderGetPayload<{
  include: {
    pickup_order: {
      include: {
        customer: true;
      };
    };
  };
}>;

export type TableOrder = CommonOrderPayload & TableOrderPayload;
export type HomeOrder = CommonOrderPayload & HomeOrderPayload;
export type PickupOrder = CommonOrderPayload & PickupOrderPayload;

export type AnyOrder = HomeOrder | PickupOrder | TableOrder;