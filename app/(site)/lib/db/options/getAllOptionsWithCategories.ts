import { OptionContracts, OptionWithCategories } from "@/app/(site)/lib/shared";
import prisma from "../prisma";
import { categoriesInclude } from "../includes";

export default async function getAllOptionsWithCategories(
  input: OptionContracts.GetAllWithCategories.Input
): Promise<OptionContracts.GetAllWithCategories.Output> {
  return await prisma.option.findMany({
    include: categoriesInclude,
  });
}
