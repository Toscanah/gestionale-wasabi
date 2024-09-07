import { OrderType } from "../../types/OrderType";
import { AnyOrder } from "../../types/PrismaOrders";
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
        include: { address: true, customer: true },
      },
      pickup_order: {
        include: { customer: true },
      },
      table_order: {
        include: {
          table: true,
        },
      },
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
    const unpaidProducts = order.products.map((product) => {
      return {
        ...product,
        quantity: product.quantity - product.paidQuantity,
        total:
          (product.quantity - product.paidQuantity) *
          (order.type == OrderType.TO_HOME
            ? product.product.home_price
            : product.product.site_price),
      };
    });

    const unpaidOrderTotal = unpaidProducts.reduce((sum, product) => {
      return (
        sum +
        product.quantity *
          (order.type == OrderType.TO_HOME
            ? product.product.home_price
            : product.product.site_price)
      );
    }, 0);

    return {
      ...order,
      products: unpaidProducts,
      total: unpaidOrderTotal,
    };
  });

  return adjustedOrders;
}
