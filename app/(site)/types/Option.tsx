import { Prisma } from "@prisma/client";

export type Option = Prisma.CategoryOnOptionGetPayload<{
  select: {
    option: true;
  };
}>;
