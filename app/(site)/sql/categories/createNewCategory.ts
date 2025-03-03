import { CategoryWithOptions } from "../../models";
import prisma from "../db";
import { optionsInclude } from "../includes";

export default async function createNewCategory(
  category: CategoryWithOptions
): Promise<CategoryWithOptions | null> {
  return await prisma.$transaction(async (tx) => {
    const existingCategory = await tx.category.findFirst({
      where: { category: category.category },
    });

    if (existingCategory) {
      return null;
    }

    const categoryData: any = { category: category.category };

    if (category.options?.length) {
      categoryData.options = {
        createMany: {
          data: category.options.map((option) => ({
            option_id: option.option.id,
          })),
        },
      };
    }

    return await tx.category.create({
      data: categoryData,
      include: optionsInclude,
    });
  });
}
