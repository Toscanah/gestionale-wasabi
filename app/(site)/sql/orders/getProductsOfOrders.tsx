import prisma from "./../db";

export default async function getOrders() {
  return await prisma.order.findMany({
    include: {
      products: true,
      customer: true,
      table: true,
      address: true
    },
  }); 
}
