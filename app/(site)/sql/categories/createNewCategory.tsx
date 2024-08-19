import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import prisma from "../db";

export default async function createNewCategory(category: CategoryWithOptions) {
  const existingCategory = await prisma.category.findFirst({
    where: {
      category: category.category,
    },
  });

  if (existingCategory) {
    return null;
  }

  return category.options && category.options.length > 0
    ? prisma.category.create({
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
        include: {
          options: {
            select: {
              option: true,
            },
          },
        },
      })
    : prisma.category.create({
        data: {
          category: category.category,
        },
        include: {
          options: {
            select: {
              option: true,
            },
          },
        },
      });
}
