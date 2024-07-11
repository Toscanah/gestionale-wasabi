import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";

export default async function addProductToOrder(
  orderId: number,
  productCode: string,
  quantity: number
) {
  const product = await prisma.product.findFirst({
    where: { code: productCode },
  });

  // TODO: bad, should pass the order type as function parameter instead
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      type: true,
    },
  });

  if (product) {
    const productTotalPrice =
      (order?.type == TypesOfOrder.TO_HOME
        ? product.home_price
        : product.site_price) * quantity;

    await prisma.order.update({
      where: {
        id: orderId,
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
        order_id: orderId,
        quantity: Number(quantity),
        total: productTotalPrice,
      },
      include: { product: true },
    });
  } else {
    return null;
  }
}
