import { OrderType } from "@prisma/client";
import addProductsToOrder from "../products/addProductsToOrder";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import createPickupOrder from "./createPickupOrder";
import createHomeOrder from "./createHomeOrder";
import createTableOrder from "./createTableOrder";
import prisma from "../db";
import deleteProductsFromOrder from "../products/deleteProductsFromOrder";

export default async function createSubOrder(
  parentOrder: AnyOrder,
  products: ProductInOrderType[]
) {
  let newSubOrder: AnyOrder | undefined = undefined;

  const suborderCount = await prisma.order.count({
    where: {
      suborderOf: parentOrder.id,
      state: {
        in: ["ACTIVE", "PAID"],
      },
    },
  });

  const suborderNumber = suborderCount + 1;
  let order;
  switch (parentOrder.type) {
    case OrderType.PICK_UP:
      order = parentOrder as PickupOrder;
      newSubOrder = (await createPickupOrder({
        name: `${order.pickup_order?.name}_${suborderNumber}`,
        when: order.pickup_order?.when ?? "Subito",
        phone: order.pickup_order?.customer?.phone?.phone,
      })) as any;
      break;
    case OrderType.TO_HOME:
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
    case OrderType.TABLE:
      order = parentOrder as TableOrder;
      newSubOrder = (await createTableOrder({
        table: `${order.table_order?.table}_${suborderNumber}`,
        people: order.table_order?.people ?? -1,
        res_name: order.table_order?.res_name ?? "",
      })) as any;
  }

  await prisma.order.update({
    where: {
      id: newSubOrder?.id ?? -1,
    },
    data: {
      suborderOf: parentOrder.id,
    },
  });

  deleteProductsFromOrder(
    products.map((product) => product.id),
    parentOrder.id
  );
  return addProductsToOrder(newSubOrder?.id ?? -1, products);
}
