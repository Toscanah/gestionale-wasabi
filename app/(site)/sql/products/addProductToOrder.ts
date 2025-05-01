import { Order } from "@prisma/client";
import prisma from "../db";
import { getProductPrice } from "../../lib/product-management/getProductPrice";
import { ProductInOrder } from "@shared";
import { categoryInclude, productInOrderInclude } from "../includes";

export default async function addProductToOrder({
  order,
  productCode,
  quantity,
}: {
  order: Order;
  productCode: string;
  quantity: number;
}): Promise<ProductInOrder | null> {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: { code: { equals: productCode, mode: "insensitive" }, active: true },
      select: { id: true, rice: true, ...categoryInclude, home_price: true, site_price: true },
    });

    if (!product) {
      return null;
    }

    const productTotalPrice =
      getProductPrice({ product: { ...product } } as any, order.type) * quantity;

    const [productInOrder] = await Promise.all([
      tx.productInOrder.create({
        data: {
          order_id: order.id,
          product_id: product.id,
          quantity: Number(quantity),
          total: productTotalPrice,
          rice_quantity: product.rice * Number(quantity) || 0,
        },
        include: { ...productInOrderInclude },
      }),

      tx.order.update({
        where: { id: order.id },
        data: {
          total: { increment: productTotalPrice },
          is_receipt_printed: false,
        },
      }),
    ]);

    return productInOrder;
  });
}
