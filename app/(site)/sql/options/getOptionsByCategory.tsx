import { Category, Option } from "@prisma/client";
import prisma from "../db";

export default async function getOptionsByCategory(categoryId: number) {
  const options = await prisma.categoryOnOption.findMany({
    where: {
      category_id: categoryId,
    },
    select: {
      option: true,
    },
  });

  return options.map((option) => option.option);
}
