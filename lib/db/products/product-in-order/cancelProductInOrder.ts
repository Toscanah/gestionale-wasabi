import { Prisma, ProductInOrder } from "@/prisma/generated/client/client";
import { ProductInOrderStatus } from "@/prisma/generated/client/enums";

type PIO = Partial<ProductInOrder> & {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  paid_quantity: number;
  options: { option_id: number }[];
};

export async function cancelProductInOrder({
  tx,
  pio,
  cooked,
}: {
  tx: Prisma.TransactionClient;
  pio: PIO;
  cooked: boolean;
}) {
  const { id, quantity, paid_quantity, product_id, order_id, options } = pio;
  const newStatus = cooked
    ? ProductInOrderStatus.DELETED_COOKED
    : ProductInOrderStatus.DELETED_UNCOOKED;

  if (paid_quantity >= quantity) {
    // Fully paid — do nothing
    return;
  }

  const unpaidQuantity = quantity - paid_quantity;

  if (paid_quantity > 0) {
    // Partially paid — split

    // Create a new PIO for the paid part
    await tx.productInOrder.create({
      data: {
        order_id,
        product_id,
        quantity: paid_quantity,
        paid_quantity,
        status: ProductInOrderStatus.IN_ORDER,
        frozen_price: pio.frozen_price ?? 0,
        options: {
          connect: options.map((opt) => ({
            id: opt.option_id,
          })),
        },
      },
    });

    // Update original PIO to only unpaid portion
    await tx.productInOrder.update({
      where: { id },
      data: {
        quantity: unpaidQuantity,
        paid_quantity: 0,
        status: newStatus,
      },
    });
  } else {
    // Fully unpaid — mark as deleted
    await tx.productInOrder.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
