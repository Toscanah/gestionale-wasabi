import prisma from "../db";

export default async function resetRice() {
  console.log("AHAHAHAHAH")
  return await prisma.rice.update({
    where: {
      id: 1
    },
    data: {
      amount: 0,
    }
  });
}