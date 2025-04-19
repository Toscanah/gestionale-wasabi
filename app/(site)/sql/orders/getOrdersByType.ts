import { OrderType } from "@prisma/client";
import { getProductPrice } from "../../lib/product-management/getProductPrice";
import prisma from "../db";
import { AnyOrder } from "@shared"
;
import { homeOrderInclude, pickupOrderInclude, productInOrderInclude } from "../includes";
import calculateOrderTotal from "../../lib/order-management/calculateOrderTotal";
export default async function getOrdersByType(type: OrderType): Promise<AnyOrder[]> {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        where: {
          is_paid_fully: false,
          state: "IN_ORDER",
        },
        include: {
          ...productInOrderInclude,
        },
      },
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
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
    const unpaidProducts = order.products.map((product) => ({
      ...product,
      quantity: product.quantity - product.paid_quantity,
      total:
        (product.quantity - product.paid_quantity) *
        getProductPrice(product, order.type as OrderType),
    }));

    const unpaidOrderTotal = calculateOrderTotal({ products: unpaidProducts, type: order.type });

    return {
      ...order,
      products: unpaidProducts,
      total: unpaidOrderTotal,
    };
  });

  return adjustedOrders;
}
