import { Option } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function createNewOption(newOption: Option): Promise<Option> {
  return await prisma.option.create({
    data: {
      active: newOption.active,
      option_name: newOption.option_name,
    },
    include: {
      categories: {
        select: {
          category: true,
        },
      },
    },
  });
}
