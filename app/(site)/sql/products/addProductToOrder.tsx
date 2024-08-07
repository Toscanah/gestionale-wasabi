import { Order } from "@prisma/client";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { ProductInOrderType } from "../../types/ProductInOrderType";

export default async function addProductToOrder(
  order: Order,
  productCode: string,
  quantity: number
): Promise<ProductInOrderType | null> {
  const product: ProductWithInfo | null = await prisma.product.findFirst({
    where: { code: productCode },
    include: { category: { include: { options: { select: { option: true } } } } },
  });

  if (!product) {
    return null;
  }

  const productTotalPrice =
    (order?.type == TypesOfOrder.TO_HOME ? product.home_price : product.site_price) * quantity;

  const productInOrder = await prisma.productInOrder.create({
    data: {
      product_id: product.id,
      order_id: order.id,
      quantity: Number(quantity),
      total: productTotalPrice,
    },
  });

  // creo i record con le opzioni di quel prodotto
  await prisma.optionInProductOrder.createMany({
    data: product.category.options.map((option) => ({
      product_in_order_id: productInOrder.id,
      option_id: option.option.id,
    })),
  });

  // aggiusto il totale dell'ordine
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
