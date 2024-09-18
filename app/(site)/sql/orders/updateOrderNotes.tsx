import prisma from "../db";

export default async function updateOrderNotes(orderId: number, notes: string) {
  // Fetch the existing homeOrder
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
      const regex = new RegExp(`,?\\s*${note}`, "gi"); // Remove the note and any preceding comma or space
      text = text.replace(regex, "").trim();
    });
    // Remove trailing comma if present
    return text.replace(/,\s*$/, "").trim();
  };

  if (notes === "") {
    updatedNotes = removePossibleNotes(updatedNotes);
  } else {
    // Remove possible notes first
    updatedNotes = removePossibleNotes(updatedNotes);

    // Add new notes, append with a comma if existing notes present
    if (updatedNotes) {
      updatedNotes = `${updatedNotes}, ${notes}`.trim();
    } else {
      updatedNotes = notes;
    }
  }

  // Update the order with the new notes
  return await prisma.homeOrder.update({
    where: { order_id: orderId },
    data: { notes: updatedNotes },
  });
}
