import prisma from "../db";

export default async function updateRice(amount: number) {
  return await prisma.rice.update({
    data: { amount },
    where: { id: 1 },
  });
}
