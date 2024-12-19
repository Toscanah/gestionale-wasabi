import { OrderType } from "@prisma/client";
import addProductsToOrder from "../products/addProductsToOrder";
import createPickupOrder from "./createPickupOrder";
import createTableOrder from "./createTableOrder";
import prisma from "../db";
import { getProductPrice } from "../../util/functions/getProductPrice";
import getOrderById from "./getOrderById";
import { AnyOrder, PickupOrder, ProductInOrder, TableOrder } from "../../models";

export default async function createSubOrder(parentOrder: AnyOrder, products: ProductInOrder[]) {
  let newSubOrder: AnyOrder | undefined;

  const suborderCount = await prisma.order.count({
    where: {
      suborder_of: parentOrder.id,
      state: {
        in: ["ACTIVE", "PAID"],
      },
    },
  });

  const suborderNumber = suborderCount + 1;
  let order;

  switch (parentOrder.type) {
    case OrderType.PICKUP:
      order = parentOrder as PickupOrder;
      newSubOrder = await createPickupOrder(
        `${order.pickup_order?.name}_${suborderNumber}`,
        order.pickup_order?.when ?? "immediate",
        order.pickup_order?.customer?.phone?.phone
      );
      break;

    case OrderType.TABLE:
      order = parentOrder as TableOrder;
      const tableOrderResponse = await createTableOrder(
        `${order.table_order?.table}_${suborderNumber}`,
        order.table_order?.people ?? 1,
        order.table_order?.res_name ?? ""
      );
      newSubOrder = tableOrderResponse?.order;
      break;

    default:
      throw new Error(`Unsupported order type: ${parentOrder.type}`);
  }

  if (!newSubOrder) {
    throw new Error("Suborder could not be created");
  }

  await prisma.order.update({
    where: {
      id: newSubOrder.id,
    },
    data: {
      suborder_of: parentOrder.id,
    },
  });

  for (const product of products) {
    const productInOrder = await prisma.productInOrder.findFirst({
      where: {
        order_id: parentOrder.id,
        product_id: product.product_id,
      },
    });

    if (productInOrder) {
      await prisma.order.update({
        where: { id: parentOrder.id },
        data: {
          is_receipt_printed: false,
        },
      });

      const newQuantity = productInOrder.quantity - product.quantity;
      const newRiceQuantity =
        productInOrder.rice_quantity - product.product.rice * product.quantity;
      const newPrintedAmount = productInOrder.printed_amount - product.quantity;

      if (newQuantity > 0) {
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: newQuantity,
            rice_quantity: newRiceQuantity,
            printed_amount: newPrintedAmount,
            total: newQuantity * getProductPrice(product, parentOrder.type),
          },
        });
      } else {
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            state: "DELETED_COOKED",
          },
        });
      }
    }
  }

  const remainingProducts = await prisma.productInOrder.findMany({
    where: { order_id: parentOrder.id, state: { not: "DELETED_COOKED" } },
  });

  const updatedTotal = remainingProducts.reduce((sum, product) => sum + product.total, 0);

  await prisma.order.update({
    where: { id: parentOrder.id },
    data: { total: updatedTotal },
  });

  await addProductsToOrder(newSubOrder.id, products);
  return await getOrderById(newSubOrder.id);
}
