import { Prisma } from "@prisma/client";

export type OrderType = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    table: true;
    products: {
      include: {
        product: true;
      };
    };
    address: true;
  };
}>;
