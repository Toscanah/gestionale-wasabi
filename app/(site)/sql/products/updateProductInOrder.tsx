import { ProductInOrderType } from "../../types/ProductInOrderType";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";

export default async function updateProductInOrder(
  orderId: number,
  key: string,
  value: any,
  productInOrder: ProductInOrderType
) {
  const currentOrder = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!currentOrder) {
    return { error: "Order not found" };
  }

  switch (key) {
    case "code":
      const newProductCode = value;
      const newProduct = await prisma.product.findFirst({
        where: { code: newProductCode },
        include: { category: { include: { options: { select: { option: true } } } } },
      });

      if (!newProduct) {
        return { error: "Product not found" };
      }

      const newTotal =
        productInOrder.quantity *
        (currentOrder.type === TypesOfOrder.TO_HOME
          ? newProduct.home_price
          : newProduct.site_price);

      const updatedProduct = await prisma.productInOrder.update({
        where: { id: productInOrder.id },
        data: {
          product_id: newProduct.id,
          total: newTotal,
        },
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: { select: { option: true } },
                },
              },
            },
          },
        },
      });

      await prisma.optionInProductOrder.deleteMany({
        where: { product_in_order_id: updatedProduct.id },
      });

      await prisma.optionInProductOrder.createMany({
        data: newProduct.category.options.map((option) => ({
          product_in_order_id: updatedProduct.id,
          option_id: option.option.id,
        })),
      });

      const difference = newTotal - productInOrder.total;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          total: (currentOrder?.total ?? 0) + difference,
        },
      });

      return { updatedProduct };
    case "quantity":
      const newQuantity = Number(value);

      if (newQuantity == 0) {
        await prisma.optionInProductOrder.deleteMany({
          where: { product_in_order_id: productInOrder.id },
        });

        const deletedProduct = await prisma.productInOrder.delete({
          where: { id: productInOrder.id },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: {
            total: {
              decrement: productInOrder.total,
            },
          },
        });

        return { deletedProduct };
      } else {
        const newTotal =
          newQuantity *
          (currentOrder.type === TypesOfOrder.TO_HOME
            ? productInOrder.product.home_price
            : productInOrder.product.site_price);
        const difference = newTotal - productInOrder.total;

        const updatedProduct = await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: newQuantity,
            total: newTotal,
          },
          include: {
            product: {
              include: {
                category: {
                  include: {
                    options: { select: { option: true } },
                  },
                },
              },
            },
          },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: {
            total: {
              increment: difference,
            },
          },
        });

        return {
          updatedProduct,
        };
      }
  }
}
