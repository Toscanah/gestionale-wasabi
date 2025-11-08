import { CategoryContracts } from "@/app/(site)/lib/shared";
import prisma from "../prisma";
import { optionsInclude } from "../includes";

export default async function getCategories(
  input: CategoryContracts.GetAll.Input
): Promise<CategoryContracts.GetAll.Output> {
  return await prisma.category.findMany({
    include: optionsInclude,
  });
}
