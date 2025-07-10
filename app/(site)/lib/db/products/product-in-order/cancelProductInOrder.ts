import { Prisma, ProductInOrder, ProductInOrderState } from "@prisma/client";

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
  const newState = cooked
    ? ProductInOrderState.DELETED_COOKED
    : ProductInOrderState.DELETED_UNCOOKED;

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
        state: ProductInOrderState.IN_ORDER,
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
        state: newState,
      },
    });
  } else {
    // Fully unpaid — mark as deleted
    await tx.productInOrder.update({
      where: { id },
      data: { state: newState },
    });
  }
}
