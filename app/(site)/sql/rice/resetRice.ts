import prisma from "../db";

export default async function resetRice() {
  return await prisma.rice.update({
    where: {
      id: 1
    },
    data: {
      amount: 0,
    }
  });
}