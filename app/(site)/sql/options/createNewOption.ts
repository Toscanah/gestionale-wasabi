import { Option } from "@/prisma/generated/zod";
import prisma from "../db";
import { OptionWithCategories } from "../../models";
import { categoriesInclude } from "../includes";

export default async function createNewOption(option: Option): Promise<OptionWithCategories> {
  return await prisma.option.create({
    data: {
      active: option.active,
      option_name: option.option_name,
    },
    include: categoriesInclude
  });
}
