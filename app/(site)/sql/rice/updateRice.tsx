import prisma from "../db";

export default async function updateRice(rice: number) {
  return await prisma.rice.update({
    data: { amount: rice },
    where: { id: 1 },
  });
}
