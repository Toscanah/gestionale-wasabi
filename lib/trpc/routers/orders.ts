import { OrderContracts } from "@/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getOrdersWithPayments from "@/lib/db/orders/getOrdersWithPayments";
import createTableOrder from "@/lib/db/orders/table/createTableOrder";
import createPickupOrder from "@/lib/db/orders/pickup/createPickupOrder";
import createHomeOrder from "@/lib/db/orders/home/createHomeOrder";
import createSubOrder from "@/lib/db/orders/sub/createSubOrder";
import updateOrderManualDiscount from "@/lib/db/orders/updateOrderManualDiscount";
import updateOrderPaymentStatus from "@/lib/db/orders/updateOrderPaymentStatus";
import updateOrderTime from "@/lib/db/orders/updateOrderTime";
import updateOrderPrintedFlag from "@/lib/db/orders/updateOrderPrintedFlag";
import updateOrderTable from "@/lib/db/orders/table/updateOrderTable";
import updateOrderExtraItems from "@/lib/db/orders/updateOrderExtraItems";
import { updateOrderShift } from "@/lib/db/orders/updateOrderShift";
import updateOrderTablePpl from "@/lib/db/orders/table/updateOrderTablePpl";
import cancelOrder from "@/lib/db/orders/cancelOrder";
import cancelOrdersInBulk from "@/lib/db/orders/cancelOrdersInBulk";
import joinTableOrders from "@/lib/db/orders/table/joinTableOrders";
import updateOrdersShift from "@/lib/db/orders/updateOrdersShift";
import computeOrdersStats from "@/lib/db/orders/computeOrdersStats";
import {
  getHomeOrders,
  getPickupOrders,
  getTableOrders,
} from "@/lib/db/orders/getOrdersByType";
import { getOrderById } from "@/lib/db/orders/getOrderById";
import computeOrdersDailyStats from "@/lib/db/orders/computeDailyOrdersStats";

export const ordersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(OrderContracts.GetById.Input)
    .output(OrderContracts.GetById.Output)
    .query(({ input }) => getOrderById(input)),

  computeDailyStats: publicProcedure
    .input(OrderContracts.ComputeDailyStats.Input)
    .output(OrderContracts.ComputeDailyStats.Output)
    .query(({ input }) => computeOrdersDailyStats(input)),

  getHomeOrders: publicProcedure
    .input(OrderContracts.GetHomeOrders.Input)
    .output(OrderContracts.GetHomeOrders.Output)
    .query(({ input }) => getHomeOrders()),

  getPickupOrders: publicProcedure
    .input(OrderContracts.GetPickupOrders.Input)
    .output(OrderContracts.GetPickupOrders.Output)
    .query(({ input }) => getPickupOrders()),

  getTableOrders: publicProcedure
    .input(OrderContracts.GetTableOrders.Input)
    .output(OrderContracts.GetTableOrders.Output)
    .query(({ input }) => getTableOrders()),

  getWithPayments: publicProcedure
    .input(OrderContracts.GetWithPayments.Input)
    .output(OrderContracts.GetWithPayments.Output)
    .query(({ input }) => getOrdersWithPayments(input)),

  createTable: publicProcedure
    .input(OrderContracts.CreateTable.Input)
    .output(OrderContracts.CreateTable.Output)
    .mutation(({ input }) => createTableOrder(input)),

  createPickup: publicProcedure
    .input(OrderContracts.CreatePickup.Input)
    .output(OrderContracts.CreatePickup.Output)
    .mutation(({ input }) => createPickupOrder(input)),

  createHome: publicProcedure
    .input(OrderContracts.CreateHome.Input)
    .output(OrderContracts.CreateHome.Output)
    .mutation(({ input }) => createHomeOrder(input)),

  createSub: publicProcedure
    .input(OrderContracts.CreateSub.Input)
    .output(OrderContracts.CreateSub.Output)
    .mutation(({ input }) => createSubOrder(input)),

  updateManualDiscount: publicProcedure
    .input(OrderContracts.UpdateManualDiscount.Input)
    .output(OrderContracts.UpdateManualDiscount.Output)
    .mutation(({ input }) => updateOrderManualDiscount(input)),

  updatePaymentStatus: publicProcedure
    .input(OrderContracts.UpdatePaymentStatus.Input)
    .output(OrderContracts.UpdatePaymentStatus.Output)
    .mutation(({ input }) => updateOrderPaymentStatus(input)),

  updateTime: publicProcedure
    .input(OrderContracts.UpdateTime.Input)
    .output(OrderContracts.UpdateTime.Output)
    .mutation(({ input }) => updateOrderTime(input)),

  updatePrintedFlag: publicProcedure
    .input(OrderContracts.UpdatePrintedFlag.Input)
    .output(OrderContracts.UpdatePrintedFlag.Output)
    .mutation(({ input }) => updateOrderPrintedFlag(input)),

  updateTable: publicProcedure
    .input(OrderContracts.UpdateTable.Input)
    .output(OrderContracts.UpdateTable.Output)
    .mutation(({ input }) => updateOrderTable(input)),

  updateExtraItems: publicProcedure
    .input(OrderContracts.UpdateExtraItems.Input)
    .output(OrderContracts.UpdateExtraItems.Output)
    .mutation(({ input }) => updateOrderExtraItems(input)),

  updateTablePpl: publicProcedure
    .input(OrderContracts.UpdateTablePpl.Input)
    .output(OrderContracts.UpdateTablePpl.Output)
    .mutation(({ input }) => updateOrderTablePpl(input)),

  cancel: publicProcedure
    .input(OrderContracts.Cancel.Input)
    .output(OrderContracts.Cancel.Output)
    .mutation(({ input }) => cancelOrder(input)),

  cancelInBulk: publicProcedure
    .input(OrderContracts.CancelInBulk.Input)
    .output(OrderContracts.CancelInBulk.Output)
    .mutation(({ input }) => cancelOrdersInBulk(input)),

  joinTables: publicProcedure
    .input(OrderContracts.JoinTables.Input)
    .output(OrderContracts.JoinTables.Output)
    .mutation(({ input }) => joinTableOrders(input)),

  updateOrdersShift: publicProcedure
    .input(OrderContracts.UpdateOrdersShift.Input)
    .output(OrderContracts.UpdateOrdersShift.Output)
    .mutation(({ input }) => updateOrdersShift(input)),

  computeStats: publicProcedure
    .input(OrderContracts.ComputeStats.Input)
    .output(OrderContracts.ComputeStats.Output)
    .query(({ input }) => computeOrdersStats(input)),
});
