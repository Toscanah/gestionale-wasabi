import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateOrderNotes(orderId: number, notes: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  const homeOrder = await prisma.homeOrder.findUnique({
    where: { order_id: orderId },
    select: { notes: true },
  });

  if (!homeOrder) {
    throw new Error("Order not found");
  }

  let updatedNotes = homeOrder.notes || "";
  const possibleNotes = ["Già pagato", "Contanti", "Carta"];

  const removePossibleNotes = (text: string) => {
    possibleNotes.forEach((note) => {
      const regex = new RegExp(`,?\\s*${note}`, "gi");
      text = text.replace(regex, "").trim();
    });
    return text.replace(/,\s*$/, "").trim();
  };

  if (notes === "") {
    updatedNotes = removePossibleNotes(updatedNotes);
  } else {
    updatedNotes = removePossibleNotes(updatedNotes);

    if (updatedNotes) {
      updatedNotes = `${updatedNotes}, ${notes}`.trim();
    } else {
      updatedNotes = notes;
    }
  }

  await prisma.homeOrder.update({
    where: { order_id: orderId },
    data: { notes: updatedNotes },
  });

  console.log(orderId)

  return await getOrderById(orderId);
}
