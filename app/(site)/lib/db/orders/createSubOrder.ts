import { OrderType } from "@prisma/client";
import addProductsToOrder from "../products/addProductsToOrder";
import createPickupOrder from "./createPickupOrder";
import createTableOrder from "./createTableOrder";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { AnyOrder, CreateSubOrderInput, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";

export default async function createSubOrder({
  parentOrder,
  products,
  isReceiptPrinted,
}: CreateSubOrderInput) {
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
      const pickupOrderResponse = await createPickupOrder({
        name: `${order.pickup_order?.name}_${suborderNumber}`,
        when: order.pickup_order?.when ?? "immediate",
        phone: order.pickup_order?.customer?.phone?.phone,
      });
      newSubOrder = pickupOrderResponse?.order;
      break;

    case OrderType.TABLE:
      order = parentOrder as TableOrder;
      const tableOrderResponse = await createTableOrder({
        table: `${order.table_order?.table}_${suborderNumber}`,
        people: order.table_order?.people ?? 1,
        resName: order.table_order?.res_name ?? "",
      });
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
      const newPrintedAmount = productInOrder.printed_amount - product.quantity;

      if (newQuantity > 0) {
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: newQuantity,
            printed_amount: newPrintedAmount,
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

  // const remainingProducts = await prisma.productInOrder.findMany({
  //   where: { order_id: parentOrder.id, state: { not: "DELETED_COOKED" } },
  // });

  await addProductsToOrder({ targetOrderId: newSubOrder.id, products });

  await prisma.order.update({
    where: { id: newSubOrder.id },
    data: {
      is_receipt_printed: isReceiptPrinted,
    },
  });

  if (parentOrder.engagements && parentOrder.engagements.length > 0) {
    // TODO: Copy engagements to the new suborder
    // const copiedEngagements = parentOrder.engagements.map((eng) => ({
    //   type: eng.type,
    //   order_id: newSubOrder.id,
    //   customer_id: eng.customer_id ?? null,
    //   payload: eng.payload ?? {},
    //   used_at: new Date(),
    //   state: EngagementState.APPLIED,
    // }));
    // await prisma.engagement.createMany({
    //   data: copiedEngagements,
    // });
  }

  return await getOrderById({ orderId: newSubOrder.id });
}
