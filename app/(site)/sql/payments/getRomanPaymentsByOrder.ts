import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import prisma from "../db";

export default async function getRomanPaymentsByOrder(orderId: number, amount: string) {
  console.log(amount);
  return await prisma.payment.count({
    where: {
      order_id: orderId,
      amount: Number(amount), // Use the rounded amount for the query
    },
  });
}
