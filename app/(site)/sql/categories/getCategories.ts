import { CategoryWithOptions } from "../../models";
import prisma from "../db";

export default async function getCategories(): Promise<CategoryWithOptions[]> {
  const cat = await prisma.category.findMany({
    include: {
      options: {
        select: {
          option: true,
        },
      },
    },
  });

  return cat;
}
