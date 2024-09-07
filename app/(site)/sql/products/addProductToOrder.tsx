import { Order } from "@prisma/client";
import { OrderType } from "../../types/OrderType";
import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { ProductInOrderType } from "../../types/ProductInOrderType";

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
    },
    include: { category: { include: { options: { select: { option: true } } } } },
  });

  if (!product) {
    return null;
  }

  const productTotalPrice =
    (order?.type == OrderType.TO_HOME ? product.home_price : product.site_price) * quantity;

  const productInOrder = await prisma.productInOrder.create({
    data: {
      order_id: order.id,
      product_id: product.id,
      quantity: Number(quantity),
      total: productTotalPrice,
      riceQuantity: product.rice * Number(quantity) ?? 0
    },
  });

  // creo i record con le opzioni di quel prodotto
  if (product.category) {
    await prisma.optionInProductOrder.createMany({
      data: product.category.options.map((option) => ({
        product_in_order_id: productInOrder.id,
        option_id: option.option.id,
      })),
    });
  }


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
