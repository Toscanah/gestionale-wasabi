import prisma from "../db";

export default async function getRice() {
  return await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });
}
