import { Option } from "@prisma/client";
import prisma from "../db";
import { categoriesInclude } from "../includes";

export default async function updateOption({ option }: { option: Option }) {
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
