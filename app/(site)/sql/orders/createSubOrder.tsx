import { OrderType } from "@prisma/client";
import addProductsToOrder from "../products/addProductsToOrder";

import createPickupOrder from "./createPickupOrder";
import createHomeOrder from "./createHomeOrder";
import createTableOrder from "./createTableOrder";
import prisma from "../db";
import { getProductPrice } from "../../util/functions/getProductPrice";
import getOrderById from "./getOrderById";
import { AnyOrder, HomeOrder, PickupOrder, ProductInOrder, TableOrder } from "../../models";

export default async function createSubOrder(parentOrder: AnyOrder, products: ProductInOrder[]) {
  let newSubOrder: AnyOrder;

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

    case OrderType.HOME:
      order = parentOrder as HomeOrder;
      newSubOrder = (await createHomeOrder(
        order.home_order.customer_id,
        order.home_order.address.id,
        order.home_order.contact_phone ?? "",
        order.home_order.notes ?? ""
      )) as any; // TODO: da sistemare il tipo, any non mi va bene
      break;

    case OrderType.TABLE:
      order = parentOrder as TableOrder;
      newSubOrder = (await createTableOrder(
        `${order.table_order?.table}_${suborderNumber}`,
        order.table_order?.people ?? 1,
        order.table_order?.res_name ?? ""
      )) as any;

      break;
  }

  if (newSubOrder) {
    await prisma.order.update({
      where: {
        id: newSubOrder.id,
      },
      data: {
        suborder_of: parentOrder.id,
      },
    });
  }

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
      const newRiceQuantity = productInOrder.rice_quantity - product.product.rice * newQuantity; // Adjust rice quantity accordingly
      const newPrintedAmount = productInOrder.printed_amount - product.quantity;

      if (newQuantity > 0) {
        // Update the quantity and rice_quantity if there's still a quantity left
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: newQuantity,
            rice_quantity: newRiceQuantity, // Adjust rice quantity
            printed_amount: newPrintedAmount,
            total: newQuantity * getProductPrice(product, parentOrder.type),
          },
        });
      } else {
        // If the quantity is 0 or less, delete the product in order
        await prisma.productInOrder.delete({
          where: { id: productInOrder.id },
        });

        // Also delete the related options in product order
        await prisma.optionInProductOrder.deleteMany({
          where: {
            product_in_order_id: productInOrder.id,
          },
        });
      }
    }
  }

  await addProductsToOrder(newSubOrder.id, products);
  return await getOrderById(newSubOrder.id);
}
