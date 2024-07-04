import prisma from "../db";

export default async function addProductToOrder(
  orderId: number,
  productCode: string,
  quantity: number
) {
  const product = await prisma.product.findFirst({
    where: { code: productCode },
  });

  if (product) {
    return await prisma.productsOnOrder.create({
      data: {
        product_id: product.id,
        order_id: orderId,
        quantity: Number(quantity),
        total: product.price * quantity,
      },
      include: { product: true },
    });
  } else {
    return null;
  }
}
