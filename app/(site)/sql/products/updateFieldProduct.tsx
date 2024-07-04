import { ProductsInOrderType } from "../../types/ProductsInOrderType";
import prisma from "../db";

export default async function updateFieldProduct(
  orderId: number,
  key: string,
  value: any,
  product: ProductsInOrderType
) {
  switch (key) {
    case "code":
      const updatedProduct = await prisma.productsOnOrder.update({
        where: {
          id: product.id,
        },
        data: {
          product_id: Number(value),
        },
        include: { product: true },
      });

      return {
        updatedProduct,
        deletedProduct: undefined,
      };

    case "quantity":
      if (Number(value) == 0) {
        return {
          deletedProduct: await prisma.productsOnOrder.delete({
            where: {
              id: product.id,
            },
          }),
        };
      }

      return {
        updatedProduct: await prisma.productsOnOrder.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: Number(value),
            total: Number(value * product.product.price),
          },

          include: {
            product: true,
          },
        }),
      };
  }
}
