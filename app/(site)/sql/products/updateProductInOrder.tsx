import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "@prisma/client";
import prisma from "../db";
import { getProductPrice } from "../../util/functions/getProductPrice";

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
        where: {
          code: {
            equals: newProductCode,
            mode: "insensitive",
          },
        },
        include: { category: { include: { options: { select: { option: true } } } } },
      });

      if (!newProduct) {
        return { error: "Product not found" };
      }

      const newTotal =
        productInOrder.quantity *
        getProductPrice({ product: { ...newProduct } } as any, currentOrder.type as OrderType);

      const updatedProduct = await prisma.productInOrder.update({
        where: { id: productInOrder.id },
        data: {
          product_id: newProduct.id,
          total: newTotal,
          riceQuantity: newProduct.rice * productInOrder.quantity,
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

      if (newProduct.category) {
        await prisma.optionInProductOrder.createMany({
          data: newProduct.category.options.map((option) => ({
            product_in_order_id: updatedProduct.id,
            option_id: option.option.id,
          })),
        });
      }

      const difference = newTotal - productInOrder.total;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          total: (currentOrder?.total ?? 0) + difference,
          isReceiptPrinted: false,
        },
      });

      return { updatedProduct };
    case "quantity":
      const newQuantity = Number(value);

      const quantityDifference = newQuantity - productInOrder.quantity;
      const totalDifference =
        quantityDifference * getProductPrice(productInOrder, currentOrder.type as OrderType);

      if (newQuantity == 0) {
        if (productInOrder.paidQuantity === 0) {
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
              isReceiptPrinted: false,
            },
          });

          return { deletedProduct };
        } else {
          const quantityDifference = productInOrder.quantity;
          const totalDifference =
            quantityDifference * getProductPrice(productInOrder, currentOrder.type as OrderType);

          const isPaidFully =
            productInOrder.paidQuantity + quantityDifference >= productInOrder.quantity;

          const updatedProduct = await prisma.productInOrder.update({
            where: { id: productInOrder.id },
            data: {
              quantity: { decrement: quantityDifference },
              total: { decrement: totalDifference },
              isPaidFully: isPaidFully,
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
              total: { decrement: totalDifference },
              isReceiptPrinted: false,
            },
          });

          return {
            deletedProduct: {
              ...updatedProduct,
              quantity: 0,
              total: 0,
            },
          };
        }
      } else {
        const updatedProduct = await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: { increment: quantityDifference },
            total: { increment: totalDifference },
            riceQuantity: { increment: quantityDifference * productInOrder.product.rice },
            printedAmount: {
              increment:
                quantityDifference > 0 // se sto incrementando, non fare nulla
                  ? 0
                  : productInOrder.printedAmount == 0 // se non ho prodotti stampati, non fare nulla
                  ? 0
                  : Math.max(quantityDifference, -productInOrder.printedAmount),
              // mi assicuro che con la differenza, non vado sotto lo zero (che non ha senso)
            },
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
            total: { increment: totalDifference },
            isReceiptPrinted: false,
          },
        });

        return {
          updatedProduct: {
            ...updatedProduct,
            quantity: newQuantity,
            total: newQuantity * getProductPrice(productInOrder, currentOrder.type),
          },
        };
      }
  }
}
