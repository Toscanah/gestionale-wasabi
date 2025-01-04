import { OrderType } from "@prisma/client";
import prisma from "../db";
import { getProductPrice } from "../../functions/product-management/getProductPrice";
import { ProductInOrder } from "../../models";

export default async function updateProductInOrder(
  orderId: number,
  key: string,
  value: any,
  productInOrder: ProductInOrder
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
        getProductPrice({ product: { ...newProduct } } as any, currentOrder.type);

      const updatedProduct = await prisma.productInOrder.update({
        where: { id: productInOrder.id },
        data: {
          product_id: newProduct.id,
          total: newTotal,
          rice_quantity: newProduct.rice * productInOrder.quantity,
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

      console.log("Sono entrato in updatePRoductInOrder parte 1");
      await prisma.optionInProductOrder.deleteMany({
        where: { product_in_order_id: productInOrder.id },
      });

      const oldProductOptions = productInOrder?.options ?? [];

      if (oldProductOptions.length > 0 && newProduct.category) {
        const validOptions = oldProductOptions.filter((oldOption) =>
          newProduct.category?.options.some(
            (newOption) => newOption.option.id === oldOption.option.id
          )
        );

        if (validOptions.length > 0) {
          // Create new options for the updated product
          await prisma.optionInProductOrder.createMany({
            data: validOptions.map((option) => ({
              product_in_order_id: updatedProduct.id,
              option_id: option.option.id,
            })),
          });
        }
      }

      const difference = newTotal - productInOrder.total;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          total: (currentOrder?.total ?? 0) + difference,
          is_receipt_printed: false,
        },
      });

      return { updatedProduct };
    case "quantity":
      const newQuantity = Number(value);

      const quantityDifference = newQuantity - productInOrder.quantity;
      const totalDifference =
        quantityDifference * getProductPrice(productInOrder, currentOrder.type as OrderType);

      if (newQuantity == 0) {
        if (productInOrder.paid_quantity === 0) {
          console.log("Sono entrato in updatePRoductInOrder parte 3");
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
              is_receipt_printed: false,
            },
          });

          return { deletedProduct };
        } else {
          const quantityDifference = productInOrder.quantity;
          const totalDifference =
            quantityDifference * getProductPrice(productInOrder, currentOrder.type as OrderType);

          const is_paid_fully =
            productInOrder.paid_quantity + quantityDifference >= productInOrder.quantity;

          const updatedProduct = await prisma.productInOrder.update({
            where: { id: productInOrder.id },
            data: {
              quantity: { decrement: quantityDifference },
              total: { decrement: totalDifference },
              is_paid_fully: is_paid_fully,
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
              is_receipt_printed: false,
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
            rice_quantity: { increment: quantityDifference * productInOrder.product.rice },
            printed_amount: {
              increment:
                quantityDifference > 0 // se sto incrementando, non fare nulla
                  ? 0
                  : productInOrder.printed_amount == 0 // se non ho prodotti stampati, non fare nulla
                  ? 0
                  : Math.max(quantityDifference, -productInOrder.printed_amount),
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
            is_receipt_printed: false,
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
