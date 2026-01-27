import { OptionContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function updateOptionsOfCategory({
  category,
  options,
}: OptionContracts.UpdateOptionsOfCategory.Input): Promise<OptionContracts.UpdateOptionsOfCategory.Output> {
  return await prisma.$transaction(async (tx) => {
    // Fetch current options linked to the category
    const currentOptions = await tx.categoryOnOption.findMany({
      where: { category_id: category.id },
      select: { option_id: true },
    });

    const currentOptionIds = currentOptions.map((opt) => opt.option_id);
    const newOptionIds = options.map((opt) => opt.id);

    const optionsToRemove = currentOptionIds.filter((id) => !newOptionIds.includes(id));
    const optionsToAdd = newOptionIds.filter((id) => !currentOptionIds.includes(id));

    // Delete only if there are options to remove
    if (optionsToRemove.length > 0) {
      await tx.categoryOnOption.deleteMany({
        where: {
          category_id: category.id,
          option_id: { in: optionsToRemove },
        },
      });
    }

    // Insert only if there are new options to add
    if (optionsToAdd.length > 0) {
      await tx.categoryOnOption.createMany({
        data: optionsToAdd.map((optionId) => ({
          category_id: category.id,
          option_id: optionId,
        })),
      });
    }

    return { added: optionsToAdd, removed: optionsToRemove };
  });
}
