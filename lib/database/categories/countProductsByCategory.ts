import { CategoryContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function countProductsByCategory(
  input: CategoryContracts.CountProductsByCategory.Input
): Promise<CategoryContracts.CountProductsByCategory.Output> {
  // 1️⃣ Count products grouped by category
  const counts = await prisma.category.findMany({
    select: {
      id: true,
      category: true,
      _count: {
        select: { products: true },
      },
    },
  });

  const uncategorizedCount = await prisma.product.count({
    where: { category_id: null },
  });

  return [
    ...counts.map((count) => ({
      categoryId: count.id,
      productCount: count._count.products,
    })),
    {
      categoryId: -1,
      productCount: uncategorizedCount,
    },
  ];
}
