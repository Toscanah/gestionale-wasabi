import prisma from "../db";
import { OptionContracts, OptionWithCategories } from "@/app/(site)/lib/shared";
import { categoriesInclude } from "../includes";

export default async function createNewOption({
  option,
}: OptionContracts.Create.Input): Promise<OptionContracts.Create.Output> {
  return await prisma.option.create({
    data: {
      option_name: option.option_name,
    },
    include: categoriesInclude,
  });
}
