import { Prisma } from "@prisma/client";

export type ProductsInOrderType = Prisma.ProductsOnOrderGetPayload<{
  include: {
    product: true;
  };
}>;
