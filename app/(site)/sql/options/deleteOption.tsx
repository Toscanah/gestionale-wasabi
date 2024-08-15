import prisma from "../db";

export default async function deleteOption(optionId: number) {
  return await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      active: false,
    },
  });
}
