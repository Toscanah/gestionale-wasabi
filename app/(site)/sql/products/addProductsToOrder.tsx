import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function addProductsToOrder(
  targetOrderId: number,
  products: ProductInOrderType[]
): Promise<ProductInOrderType[] | []> {
  const productTotalPrice = products.reduce((sum, product) => sum + product.total, 0);

  const newProducts = await Promise.all(
    products.map(async (productInOrder) => {
      // Create the productInOrder
      const newProductInOrder = await prisma.productInOrder.create({
        data: {
          order_id: targetOrderId,
          product_id: productInOrder.product.id,
          quantity: productInOrder.quantity,
          total: productInOrder.total,
          riceQuantity: productInOrder.product.rice * productInOrder.quantity,
        },
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

      return newProductInOrder;
    })
  );

  // Update the total price of the order
  await prisma.order.update({
    where: {
      id: targetOrderId,
    },
    data: {
      total: {
        increment: productTotalPrice,
      },
    },
  });

  return newProducts;
}
