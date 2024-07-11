import { Prisma } from "@prisma/client";

export type ProductInOrderType = Prisma.ProductOnOrderGetPayload<{
  include: {
    product: true;
  };
}>;
