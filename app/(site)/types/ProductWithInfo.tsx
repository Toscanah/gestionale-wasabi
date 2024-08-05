import { Prisma } from "@prisma/client";

export type ProductWithInfo = Prisma.ProductGetPayload<{
  include: {
    category: {
      include: {
        options: {
          include: {
            option: true;
          };
        };
      };
    };
    options: {
      include: {
        option: true;
      };
    };
  };
}>;
