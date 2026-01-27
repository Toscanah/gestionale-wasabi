import { CategoryContracts, CategoryWithOptions } from "@/lib/shared";
import prisma from "../prisma";
import { optionsInclude } from "../includes";

export default async function updateCategory({
  category,
}: CategoryContracts.Update.Input): Promise<CategoryContracts.Update.Output> {
  const currentOptions = await prisma.categoryOnOption.findMany({
    where: { category_id: category.id },
    select: { option_id: true },
  });

  const currentOptionIds = currentOptions.map((opt) => opt.option_id);
  const newOptionIds = category.options.map((opt) => opt.option.id);

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

  return await prisma.category.update({
    where: { id: category.id },
    data: {
      category: category.category,
    },
    include: optionsInclude,
  });
}
