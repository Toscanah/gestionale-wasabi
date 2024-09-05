import { OrderType } from "@prisma/client";
import { HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import prisma from "../db";

export default async function copyFromOrder(
  sourceOrder: PickupOrder | HomeOrder,
  targetOrder: PickupOrder | HomeOrder
): Promise<ProductInOrderType[] | []> {
  // Fetch the products from the source order
  const baseOrder = await prisma.order.findUnique({
    where: { id: sourceOrder.id },
    select: {
      products: {
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
            select: {
              option: true,
            },
          },
        },
      },
    },
  });

  if (!baseOrder || !baseOrder.products) {
    return [];
  }

  await Promise.all(
    baseOrder.products.map(async (productInOrder) => {
      return await prisma.productInOrder.create({
        data: {
          order_id: targetOrder.id,
          product_id: productInOrder.product.id,
          quantity: productInOrder.quantity,
          // options: {
          //   create: productInOrder.options.map((opt) => ({
          //     option_id: opt.option.id,
          //   })),
          // },
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
    })
  );

  return baseOrder.products;
}
