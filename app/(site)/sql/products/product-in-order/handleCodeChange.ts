import { ProductInOrder } from "@/app/(site)/models";
import { OrderType, Prisma } from "@prisma/client";
import { categoryInclude, productInOrderInclude } from "../../includes";
import { getProductPrice } from "@/app/(site)/functions/product-management/getProductPrice";

export default async function handleProductCodeChange(
  tx: Prisma.TransactionClient,
  currentOrder: { id: number; total: number; type: OrderType },
  newProductCode: string,
  productInOrder: ProductInOrder
) {
  const newProduct = await tx.product.findFirst({
    where: { code: { equals: newProductCode, mode: "insensitive" } },
    include: { ...categoryInclude },
  });

  if (!newProduct) {
    return { error: "Product not found" };
  }

  if (productInOrder.product.code.toUpperCase() === newProduct.code.toUpperCase()) {
    return { updatedProduct: productInOrder };
  }

  const newTotal =
    productInOrder.quantity *
    getProductPrice({ product: { ...newProduct } } as any, currentOrder.type);

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      product_id: newProduct.id,
      total: newTotal,
      rice_quantity: newProduct.rice * productInOrder.quantity,
      printed_amount: 0,
    },
    include: { ...productInOrderInclude },
  });

  // Remove old options
  await tx.optionInProductOrder.deleteMany({ where: { product_in_order_id: productInOrder.id } });

  // Add valid options from old product if applicable
  if (productInOrder.options?.length && newProduct.category) {
    const validOptions = productInOrder.options.filter((oldOption) =>
      newProduct.category?.options.some((newOption) => newOption.option.id === oldOption.option.id)
    );

    if (validOptions.length > 0) {
      await tx.optionInProductOrder.createMany({
        data: validOptions.map((option) => ({
          product_in_order_id: updatedProduct.id,
          option_id: option.option.id,
        })),
      });
    }
  }

  // Update order total
  await tx.order.update({
    where: { id: currentOrder.id },
    data: {
      total: currentOrder.total + (newTotal - productInOrder.total),
      is_receipt_printed: false,
    },
  });

  return { updatedProduct };
}
