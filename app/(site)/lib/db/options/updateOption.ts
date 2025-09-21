import prisma from "../db";
import { categoriesInclude } from "../includes";
import { OptionContracts } from "../../shared";

export default async function updateOption({
  option,
}: OptionContracts.Update.Input): Promise<OptionContracts.Update.Output> {
  return await prisma.option.update({
    where: {
      id: option.id,
    },
    data: {
      option_name: option.option_name,
    },
    include: categoriesInclude,
  });
}
