import prisma from "../db";

export default async function createDefaultRice() {
  console.log("entrato")
  
  const existingRice = await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });

  if (existingRice) return {};

  return await prisma.rice.create({
    data: {
      id: 1,
      amount: 0,
      threshold: 0,
    },
  });
}
