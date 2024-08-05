import { Prisma } from "@prisma/client";

export type ProductInOrderType = Prisma.ProductOnOrderGetPayload<{
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
}>;
