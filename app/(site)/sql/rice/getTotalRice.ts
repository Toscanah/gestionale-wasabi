import prisma from "../db";

export default async function getTotalRice() {
  return await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });
}
