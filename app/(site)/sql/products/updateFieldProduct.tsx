import { ProductsInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function updateFieldProduct(
  orderId: number,
  key: string,
  value: any,
  product: ProductsInOrderType
) {
  switch (key) {
    // case "code":
    //   const updatedProduct = await prisma.productsOnOrder.update({
    //     where: {
    //       id: product.id,
    //     },
    //     data: {
    //       product_id: Number(value),
    //     },
    //     include: { product: true },
    //   });

    //   return {
    //     updatedProduct,
    //     deletedProduct: undefined,
    //   };

    case "quantity":
      const newQuantity = Number(value);

      if (newQuantity == 0) {
        const deletedProduct = await prisma.productsOnOrder.delete({
          where: {
            id: product.id,
          },
        });

        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            total: {
              decrement: product.total,
            },
          },
        });

        return {
          deletedProduct,
          updatedProduct: undefined,
        };
      } else {
        const newTotal = newQuantity * product.product.price;
        const difference = newTotal - product.total;

        const updatedProduct = await prisma.productsOnOrder.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: newQuantity,
            total: newTotal,
          },
          include: {
            product: true,
          },
        });

        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            total: {
              increment: difference,
            },
          },
        });

        return {
          updatedProduct,
          deletedProduct: undefined,
        };
      }
  }
}
