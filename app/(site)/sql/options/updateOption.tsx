import { Option } from "@prisma/client";
import prisma from "../db";

export default async function updateOption(option: Option) {
  return await prisma.option.update({
    where: {
      id: option.id,
    },
    data: {
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
