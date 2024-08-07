import { Prisma } from "@prisma/client";

export type ProductInOrderType = Prisma.ProductInOrderGetPayload<{
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
    },
    options: {
      select: {
        option: true,
      }
    }
  };
}>;
