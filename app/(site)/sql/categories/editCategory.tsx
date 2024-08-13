import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import prisma from "../db";

export default async function editCategory(category: CategoryWithOptions) {
  const currentOptions = await prisma.categoryOnOption.findMany({
    where: { category_id: category.id },
    select: { option_id: true },
  });

  const currentOptionIds = currentOptions.map((opt) => opt.option_id);
  const newOptionIds = category.options.map((opt: any) => opt.option.id);

  const optionsToRemove = currentOptionIds.filter((id) => !newOptionIds.includes(id));
  const optionsToAdd = newOptionIds.filter((id) => !currentOptionIds.includes(id));

  // Remove options that are not in the new list
  await prisma.categoryOnOption.deleteMany({
    where: {
      category_id: category.id,
      option_id: {
        in: optionsToRemove,
      },
    },
  });

  // Add new options that are not in the current list
  await prisma.categoryOnOption.createMany({
    data: optionsToAdd.map((optionId) => ({
      category_id: category.id,
      option_id: optionId,
    })),
  });

  return await prisma.category.update({
    where: { id: category.id },
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
