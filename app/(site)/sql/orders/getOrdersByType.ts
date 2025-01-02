import { OrderType } from "@prisma/client";
import { getProductPrice } from "../../functions/product-management/getProductPrice";
import prisma from "../db";
import { AnyOrder } from "../../models";
export default async function getOrdersByType(type: OrderType): Promise<AnyOrder[]> {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        where: {
          is_paid_fully: false,
        },
        include: {
          product: {
            include: {
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
          options: { include: { option: true } },
        },
      },
      payments: true,
      home_order: {
        include: { address: true, customer: { include: { phone: true } } },
      },
      pickup_order: {
        include: { customer: { include: { phone: true } } },
      },
      table_order: true,
    },
    where: {
      type: type,
      state: "ACTIVE",
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const adjustedOrders = orders.map((order) => {
    const unpaidProducts = order.products
      .filter((prod) => prod.state == "IN_ORDER")
      .map((product) => ({
        ...product,
        quantity: product.quantity - product.paid_quantity,
        total:
          (product.quantity - product.paid_quantity) *
          getProductPrice(product, order.type as OrderType),
      }));

    const unpaidOrderTotal = unpaidProducts.reduce(
      (sum, product) => sum + product.quantity * getProductPrice(product, order.type as OrderType),
      0
    );

    return {
      ...order,
      products: unpaidProducts,
      total: unpaidOrderTotal,
    };
  });

  return adjustedOrders;
}
