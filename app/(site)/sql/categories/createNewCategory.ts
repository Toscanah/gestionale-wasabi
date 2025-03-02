import { CategoryWithOptions } from "../../models";
import prisma from "../db";
import { optionsInclude } from "../includes";

export default async function createNewCategory(
  category: CategoryWithOptions
): Promise<CategoryWithOptions | null> {
  const existingCategory = await prisma.category.findFirst({
    where: {
      category: category.category,
    },
  });

  if (existingCategory) {
    return null;
  }

  if (category.options && category.options.length > 0) {
    return prisma.category.create({
      data: {
        category: category.category,
        options: {
          createMany: {
            data: category.options.map((option) => ({
              option_id: option.option.id,
            })),
          },
        },
      },
      include: optionsInclude,
    });
  } else {
    return prisma.category.create({
      data: {
        category: category.category,
      },
      include: optionsInclude,
    });
  }
}
