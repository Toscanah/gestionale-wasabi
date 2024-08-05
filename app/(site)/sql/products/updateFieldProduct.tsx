import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function updateFieldProduct(
  orderId: number,
  key: string,
  value: any,
  productInOrder: ProductInOrderType
) {
  switch (key) {
    case "code":
      const newProductCode = value;

      const newProduct = await prisma.product.findFirst({
        where: { code: newProductCode },
      });
      console.log(newProduct);
      if (!newProduct) {
        return { error: "Product not found" };
      }

      const newTotal = productInOrder.quantity * newProduct.home_price;

      // TODO: vedere che tipo siamo e usare home_price o site_price
      const updatedProduct = await prisma.productOnOrder.update({
        where: {
          id: productInOrder.id,
        },
        data: {
          product_id: newProduct.id,
          total: newTotal,
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

      const currentOrder = await prisma.order.findUnique({
        where: { id: orderId },
        select: { total: true },
      });

      const difference = newTotal - productInOrder.total;
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          total: (currentOrder?.total ?? 0) + difference,
        },
      });

      return {
        updatedProduct,
      };

    case "quantity":
      const newQuantity = Number(value);

      if (newQuantity == 0) {
        const deletedProduct = await prisma.productOnOrder.delete({
          where: {
            id: productInOrder.id,
          },
        });

        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            total: {
              decrement: productInOrder.total,
            },
          },
        });

        return {
          deletedProduct,
        };
      } else {
        // TODO: vedere che tipo siamo e usare home_price o site_price
        const newTotal = newQuantity * productInOrder.product.home_price;
        const difference = newTotal - productInOrder.total;

        const updatedProduct = await prisma.productOnOrder.update({
          where: {
            id: productInOrder.id,
          },
          data: {
            quantity: newQuantity,
            total: newTotal,
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
        };
      }
  }
}
