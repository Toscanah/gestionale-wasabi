import prisma from "../db";

export default async function toggleCategory(categoryId: number) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    return null;
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      active: !category.active,
    },
  });
}
