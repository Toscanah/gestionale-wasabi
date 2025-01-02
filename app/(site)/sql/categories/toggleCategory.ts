import prisma from "../db";

export default async function toggleCategory(id: number) {
  const categoryId = id;
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
