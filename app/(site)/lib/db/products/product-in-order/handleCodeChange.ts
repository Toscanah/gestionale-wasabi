import { ProductContracts, ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType, Prisma } from "@prisma/client";
import { categoryInclude, productInOrderInclude } from "../../includes";
import { getProductPrice } from "@/app/(site)/lib/services/product-management/getProductPrice";

export default async function handleProductCodeChange({
  tx,
  currentOrder,
  newProductCode,
  productInOrder,
}: {
  tx: Prisma.TransactionClient;
  currentOrder: { id: number; type: OrderType };
  newProductCode: string;
  productInOrder: ProductInOrder;
}): Promise<ProductContracts.UpdateInOrder.Output> {
  const newProduct = await tx.product.findFirst({
    where: { code: { equals: newProductCode, mode: "insensitive" } },
    include: { ...categoryInclude },
  });

  if (!newProduct) {
    throw new Error("Product with the provided code does not exist");
  }

  if (productInOrder.product.code.toUpperCase() === newProduct.code.toUpperCase()) {
    return { updatedProductInOrder: productInOrder };
  }

  const updatedProduct = await tx.productInOrder.update({
    where: { id: productInOrder.id },
    data: {
      product_id: newProduct.id,
      last_printed_quantity: 0,
      frozen_price: getProductPrice({ product: newProduct }, currentOrder.type),
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

  await tx.order.update({
    where: { id: currentOrder.id },
    data: {
      is_receipt_printed: false,
    },
  });

  return { updatedProductInOrder: updatedProduct };
}
