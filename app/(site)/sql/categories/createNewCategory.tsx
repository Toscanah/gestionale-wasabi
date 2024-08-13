import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import prisma from "../db";

export default async function createNewCategory(category: CategoryWithOptions) {
  

  return category.options && category.options.length > 0
    ? prisma.category.create({
        data: {
          category: category.category,
          options: {
            connect: [
              ...category.options.map((option) => ({
                id: option.option.id,
              })),
            ],
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
