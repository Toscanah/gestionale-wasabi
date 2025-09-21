import { CategoryContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { optionsInclude } from "../includes";
import { Prisma } from "@prisma/client";

export default async function createNewCategory({
  category,
}: CategoryContracts.Create.Input): Promise<CategoryContracts.Create.Output> {
  const { category: categoryName, options } = category;
  return await prisma.$transaction(async (tx) => {
    const existingCategory = await tx.category.findFirst({
      where: { category: categoryName },
    });

    if (existingCategory) {
      return null;
    }

    const data: Prisma.CategoryCreateInput = { category: categoryName };

    if (options?.length) {
      data.options = {
        createMany: {
          data: options.map((option) => ({
            option_id: option.option.id,
          })),
        },
      };
    }

    return await tx.category.create({
      data,
      include: optionsInclude,
    });
  });
}
