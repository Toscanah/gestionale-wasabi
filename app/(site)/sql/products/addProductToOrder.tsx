import { Order } from "@prisma/client";
import { OrderType } from "@prisma/client";
import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { getProductPrice } from "../../util/functions/getProductPrice";

export default async function addProductToOrder(
  order: Order,
  productCode: string,
  quantity: number
): Promise<ProductInOrderType | null> {
  const product = await prisma.product.findFirst({
    where: {
      code: {
        equals: productCode,
        mode: "insensitive",
      },
      active: true,
    },
    include: { category: { include: { options: { select: { option: true } } } } },
  });

  if (!product) {
    return null;
  }

  const productTotalPrice =
    getProductPrice({ product: { ...product } } as any, order.type as OrderType) * quantity;

    console.log(productTotalPrice);

  const productInOrder = await prisma.productInOrder.create({
    data: {
      order_id: order.id,
      product_id: product.id,
      quantity: Number(quantity),
      total: productTotalPrice,
      riceQuantity: product.rice * Number(quantity) ?? 0,
    },
  });

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      total: {
        increment: productTotalPrice,
      },
    },
  });

  // ritorno il prodotto ora con i vari record delle opzioni che ho aggiunto sopra
  return await prisma.productInOrder.findUnique({
    where: { id: productInOrder.id },
    include: {
      product: {
        include: {
          category: {
            include: {
              options: {
                select: {
                  option: true,
                },
              },
            },
          },
        },
      },
      options: {
        include: {
          option: true,
        },
      },
    },
  });
}
