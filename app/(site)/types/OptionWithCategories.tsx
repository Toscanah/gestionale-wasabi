import { Prisma } from "@prisma/client";

export type OptionWithCategories = Prisma.OptionGetPayload<{
  include: { categories: { select: { category: true } } };
}>;
