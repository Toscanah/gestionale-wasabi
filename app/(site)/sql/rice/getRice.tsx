import prisma from "../db";

export default async function getRice() {
  const rice = await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });

  return rice?.amount;
}
