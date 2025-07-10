import { ProductInOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { productInOrderInclude } from "../includes";
import { getProductPrice } from "../../services/product-management/getProductPrice";

export default async function addProductsToOrder({
  targetOrderId,
  products,
}: {
  targetOrderId: number;
  products: ProductInOrder[];
}): Promise<ProductInOrder[]> {
  const targetOrder = await prisma.order.findUnique({
    where: { id: targetOrderId },
    select: { type: true },
  });

  if (!targetOrder) {
    throw new Error("Target order not found");
  }

  const newProducts = await Promise.all(
    products.map(
      async (productInOrder) =>
        await prisma.productInOrder.create({
          data: {
            order_id: targetOrderId,
            product_id: productInOrder.product.id,
            quantity: productInOrder.quantity,
            additional_note: productInOrder.additional_note,
            frozen_price: getProductPrice(productInOrder, targetOrder.type),
          },
          include: {
            ...productInOrderInclude,
          },
        })
    )
  );

  const optionsToCreate = newProducts.flatMap((newProduct, index) =>
    (products[index].options || []).map((option) => ({
      product_in_order_id: newProduct.id,
      option_id: option.option.id,
    }))
  );

  if (optionsToCreate.length > 0) {
    await prisma.optionInProductOrder.createMany({
      data: optionsToCreate,
    });
  }

  await prisma.order.update({
    where: {
      id: targetOrderId,
    },
    data: {
      is_receipt_printed: false,
    },
  });

  const productIds = newProducts.map((p) => p.id);
  const finalProducts = await prisma.productInOrder.findMany({
    where: {
      id: { in: productIds },
    },
    include: { ...productInOrderInclude },
  });

  return finalProducts;
}
