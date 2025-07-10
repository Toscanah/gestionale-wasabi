import { Option } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function deleteOption({ optionId }: { optionId: number }): Promise<Option> {
  return await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      active: false,
    },
  });
}
