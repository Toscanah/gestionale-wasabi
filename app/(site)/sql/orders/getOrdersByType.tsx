import { OrderType } from "@prisma/client";
import { getProductPrice } from "../../util/functions/getProductPrice";
import prisma from "../db";

export default async function getOrdersByType(type: OrderType) {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        where: {
          isPaidFully: false,
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
          options: {
            include: {
              option: true,
            },
          },
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
      .map((product) => {
        return {
          ...product,
          quantity: product.quantity - product.paidQuantity,
          total:
            (product.quantity - product.paidQuantity) *
            getProductPrice(product, order.type as OrderType),
        };
      });

    const unpaidOrderTotal = unpaidProducts.reduce((sum, product) => {
      return sum + product.quantity * getProductPrice(product, order.type as OrderType);
    }, 0);

    return {
      ...order,
      products: unpaidProducts,
      total: unpaidOrderTotal,
    };
  });

  return adjustedOrders;
}
