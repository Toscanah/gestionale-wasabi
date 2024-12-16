import { Option } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function createNewOption(option: Option): Promise<Option> {
  return await prisma.option.create({
    data: {
      active: option.active,
      option_name: option.option_name,
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
