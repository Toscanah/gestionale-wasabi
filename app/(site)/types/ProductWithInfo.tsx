import { Prisma } from "@prisma/client";

export type ProductWithInfo = Prisma.ProductGetPayload<{
  include: {
    category: true;
    options: true;
  };
}>;
