import { Order } from "@prisma/client";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";

export default async function addProductToOrder(
  order: Order,
  productCode: string,
  quantity: number
) {
  const product = await prisma.product.findFirst({
    where: { code: productCode },
  });

  if (product) {
    const productTotalPrice =
      (order?.type == TypesOfOrder.TO_HOME ? product.home_price : product.site_price) * quantity;

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

    return await prisma.productOnOrder.create({
      data: {
        product_id: product.id,
        order_id: order.id,
        quantity: Number(quantity),
        total: productTotalPrice,
      },
      include: {
        product: {
          include: {
            options: {
              include: {
                option: true,
              },
            },
            category: {
              include: {
                options: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  } else {
    return null;
  }
}
