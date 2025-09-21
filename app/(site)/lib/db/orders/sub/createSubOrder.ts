import { OrderStatus, OrderType, ProductInOrderStatus } from "@prisma/client";
import prisma from "../../db";
import createPickupOrder from "../pickup/createPickupOrder";
import createTableOrder from "../table/createTableOrder";
import addProductsToOrder from "../../products/addProductsToOrder";
import getOrderById from "../getOrderById";
import { AnyOrder, OrderContracts, PickupOrder, TableOrder } from "../../../shared";

export default async function createSubOrder({
  parentOrder,
  products,
  isReceiptPrinted,
}: OrderContracts.CreateSub.Input): Promise<OrderContracts.CreateSub.Output> {
  let newSubOrder: AnyOrder | undefined;

  const suborderCount = await prisma.order.count({
    where: {
      suborder_of: parentOrder.id,
      status: {
        in: [OrderStatus.ACTIVE, OrderStatus.PAID],
      },
    },
  });

  const suborderNumber = suborderCount + 1;
  let order: AnyOrder;

  switch (parentOrder.type) {
    case OrderType.PICKUP:
      order = parentOrder as PickupOrder;

      const pickupOrderResponse = await createPickupOrder({
        name: `${order.pickup_order?.name}_${suborderNumber}`,
        when: order.pickup_order?.when ?? "immediate",
        phone: order.pickup_order?.customer?.phone.phone ?? "",
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

      if (newQuantity > 0) {
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            quantity: newQuantity,
            last_printed_quantity: {
              set: Math.min(productInOrder.last_printed_quantity, newQuantity),
            },
          },
        });
      } else {
        await prisma.productInOrder.update({
          where: { id: productInOrder.id },
          data: {
            status: ProductInOrderStatus.DELETED_COOKED,
          },
        });
      }
    }
  }

  await addProductsToOrder({ orderId: newSubOrder.id, products });

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
