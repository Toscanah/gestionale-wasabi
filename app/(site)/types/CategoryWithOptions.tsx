import { Prisma } from "@prisma/client";

export type CategoryWithOptions = Prisma.CategoryGetPayload<{
  include: {
    options: {
      select: {
        option: true;
      };
    };
  };
}>;
