import prisma from "../db";
import { getProductPrice } from "../../services/product-management/getProductPrice";
import { ProductContracts } from "@/app/(site)/lib/shared";
import { categoryInclude, productInOrderInclude } from "../includes";

export default async function addProductToOrder({
  order,
  productCode,
  quantity,
}: ProductContracts.AddToOrder.Input): Promise<ProductContracts.AddToOrder.Output> {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: { code: { equals: productCode, mode: "insensitive" }, active: true },
      select: { id: true, rice: true, ...categoryInclude, home_price: true, site_price: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const frozenPrice = getProductPrice({ product: product as any }, order.type);

    const [productInOrder] = await Promise.all([
      tx.productInOrder.create({
        data: {
          order_id: order.id,
          product_id: product.id,
          quantity: Number(quantity),
          frozen_price: frozenPrice,
        },
        include: { ...productInOrderInclude },
      }),

      tx.order.update({
        where: { id: order.id },
        data: {
          is_receipt_printed: false,
        },
      }),
    ]);

    return productInOrder;
  });
}
