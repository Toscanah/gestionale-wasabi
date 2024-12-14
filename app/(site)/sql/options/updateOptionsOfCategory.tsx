import { Category, Option } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function updateOptionsOfCategory(category: Category, options: Option[]) {
  const currentOptions = await prisma.categoryOnOption.findMany({
    where: { category_id: category.id },
    select: { option_id: true },
  });

  const currentOptionIds = currentOptions.map((opt) => opt.option_id);
  const newOptionIds = options.map((opt) => opt.id);

  const optionsToRemove = currentOptionIds.filter((id) => !newOptionIds.includes(id));
  const optionsToAdd = newOptionIds.filter((id) => !currentOptionIds.includes(id));

  await prisma.categoryOnOption.deleteMany({
    where: {
      category_id: category.id,
      option_id: {
        in: optionsToRemove,
      },
    },
  });

  await prisma.categoryOnOption.createMany({
    data: optionsToAdd.map((optionId) => ({
      category_id: category.id,
      option_id: optionId,
    })),
  });

  return { added: optionsToAdd, removed: optionsToRemove };
}
