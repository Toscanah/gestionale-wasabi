import { OptionWithCategories } from "../../models";
import prisma from "../db";
import { categoriesInclude } from "../includes";

export default async function getAllOptionsWithCategories(): Promise<OptionWithCategories[]> {
  return await prisma.option.findMany({
    include: categoriesInclude
  });
}
