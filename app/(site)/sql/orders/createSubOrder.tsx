import { OrderType } from "@prisma/client";
import addProductsToOrder from "../products/addProductsToOrder";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import createPickupOrder from "./createPickupOrder";
import createHomeOrder from "./createHomeOrder";
import createTableOrder from "./createTableOrder";
import prisma from "../db";
import { getProductPrice } from "../../util/functions/getProductPrice";
import getOrderById from "./getOrderById";

export default async function createSubOrder(
  parentOrder: AnyOrder,
  products: ProductInOrderType[]
) {
  let newSubOrder: { order: AnyOrder; new: boolean };

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
      newSubOrder = (await createPickupOrder({
        name: `${order.pickup_order?.name}_${suborderNumber}`,
        when: order.pickup_order?.when ?? "immediate",
        phone: order.pickup_order?.customer?.phone?.phone,
      })) as any;
      break;

    case OrderType.HOME:
      order = parentOrder as HomeOrder;
      newSubOrder = (await createHomeOrder({
        customer: order.home_order?.customer as any,
        address: {
          ...(order.home_order?.address as any),
          doorbell: `${order.home_order?.address?.doorbell ?? ""}_${suborderNumber}`,
        },
        contact_phone: order.home_order?.contact_phone ?? "",
        notes: order.home_order?.notes ?? "",
      })) as any;
      break;

    case OrderType.TABLE:
      order = parentOrder as TableOrder;
      newSubOrder = (await createTableOrder({
        table: `${order.table_order?.table}_${suborderNumber}`,
        people: order.table_order?.people ?? 1,
        res_name: order.table_order?.res_name ?? "",
      })) as any;

      break;
  }

  if (newSubOrder) {
    await prisma.order.update({
      where: {
        id: newSubOrder.order.id,
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

  await addProductsToOrder(newSubOrder.order.id, products);
  return await getOrderById(newSubOrder.order.id);
}
