import prisma from "../db";

export default async function toggleOption({ id }: { id: number }) {
  const optionId = id;
  const option = await prisma.option.findUnique({ where: { id: optionId } });

  if (!option) {
    return null;
  }

  return prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      active: !option.active,
    },
  });
}
