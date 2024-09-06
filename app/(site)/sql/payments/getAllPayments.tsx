import prisma from "../db";

export default async function getAllPayments() {
  return await prisma.payment.findMany({
    include: {
      order: {
        include: {
          home_order: true,
          pickup_order: true,
          table_order: true,
        }
      }
    }
  });
}