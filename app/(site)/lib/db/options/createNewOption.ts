import prisma from "../prisma";
import { OptionContracts, OptionWithCategories } from "@/app/(site)/lib/shared";
import { categoriesInclude } from "../includes";
import { TRPCError } from "@trpc/server";

export default async function createNewOption({
  option,
}: OptionContracts.Create.Input): Promise<OptionContracts.Create.Output> {
  const existingOption = await prisma.option.findFirst({
    where: {
      option_name: option.option_name,
    },
  });

  if (existingOption) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Option with this name already exists.",
    });
  }

  return await prisma.option.create({
    data: {
      option_name: option.option_name,
    },
    include: categoriesInclude,
  });
}
