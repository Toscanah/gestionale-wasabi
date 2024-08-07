import { Prisma } from "@prisma/client";

export type ProductWithInfo = Prisma.ProductGetPayload<{
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
}>;
