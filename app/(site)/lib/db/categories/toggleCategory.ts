import { Category } from "@prisma/client";
import prisma from "../db";

export default async function toggleCategory({ id }: { id: number }): Promise<Category | null> {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    return null;
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      active: !category.active,
    },
  });
}
