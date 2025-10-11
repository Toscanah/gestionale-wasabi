import prisma from "../db";
import { CategoryContracts } from "../../shared";

export default async function toggleCategory({
  id,
}: CategoryContracts.Toggle.Input): Promise<CategoryContracts.Toggle.Output> {
  const category = await prisma.category.findUnique({ where: { id }, select: { active: true } });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      active: !category.active,
    },
    select: {
      id: true,
      active: true,
    },
  });
}
