import { OrderType, PlannedPayment, WorkingShift } from "@prisma/client";
import { z } from "zod";
import { NoContentSchema, wrapSchema } from "./common";
import { AnyOrderSchema, ProductInOrderWithOptionsSchema } from "../models/_index";
import { SchemaInputs } from "../types/SchemaInputs";

export const GetOrderByIdSchema = z.object({
  orderId: z.number(),
  variant: z.string().default("onlyPaid"),
});

export const GetOrdersByTypeSchema = wrapSchema("type", z.nativeEnum(OrderType));

export const CreateTableOrderSchema = z.object({
  table: z.string(),
  people: z.number(),
  resName: z.string().optional(),
});

export const CreatePickupOrderSchema = z.object({
  name: z.string(),
  when: z.string(),
  phone: z.string(),
});

export const CreateHomeOrderSchema = z.object({
  customerId: z.number(),
  addressId: z.number(),
  contactPhone: z.string(),
});

export const CreateSubOrderSchema = z.object({
  parentOrder: AnyOrderSchema,
  products: z.array(ProductInOrderWithOptionsSchema),
  isReceiptPrinted: z.boolean(),
});

export const UpdateOrderDiscountSchema = z.object({
  orderId: z.number(),
  discount: z.number().optional(),
});

export const UpdateOrderPaymentStatusSchema = z.object({
  orderId: z.number(),
  prepaid: z.boolean(),
  plannedPayment: z.nativeEnum(PlannedPayment),
});

export const UpdateOrderTimeSchema = z.object({
  orderId: z.number(),
  time: z.string(),
});

export const UpdateOrderPrintedFlagSchema = wrapSchema("orderId", z.number());

export const JoinTableOrdersSchema = z.object({
  tableToJoin: z.string(),
  originalOrderId: z.number(),
});

export const UpdateOrderTableSchema = z.object({
  table: z.string(),
  orderId: z.number(),
});

export const UpdateOrderExtraItemsSchema = z.object({
  orderId: z.number(),
  items: z.enum(["salads", "soups", "rices"]),
  value: z.number().nullable(),
});

export const UpdateOrderShiftSchema = z.object({
  orderId: z.number(),
  shift: z.nativeEnum(WorkingShift),
});

export const CancelOrderSchema = z.object({
  orderId: z.number(),
  cooked: z.boolean().optional().default(false),
});

export const CancelOrdersInBulkSchema = z.object({
  orderIds: z.array(z.number()),
  productsCooked: z.boolean(),
});

export const UpdateOrderTablePplSchema = z.object({
  orderId: z.number(),
  people: z.number(),
});

export const ORDER_SCHEMAS = {
  getOrderById: GetOrderByIdSchema,
  getOrdersByType: GetOrdersByTypeSchema,
  updateOrderDiscount: UpdateOrderDiscountSchema,
  updateOrderPaymentStatus: UpdateOrderPaymentStatusSchema,
  createTableOrder: CreateTableOrderSchema,
  createPickupOrder: CreatePickupOrderSchema,
  createHomeOrder: CreateHomeOrderSchema,
  updateOrderTime: UpdateOrderTimeSchema,
  cancelOrder: CancelOrderSchema,
  createSubOrder: CreateSubOrderSchema,
  updateOrderPrintedFlag: UpdateOrderPrintedFlagSchema,
  cancelOrdersInBulk: CancelOrdersInBulkSchema,
  deleteEverything: NoContentSchema,
  joinTableOrders: JoinTableOrdersSchema,
  updateOrderTable: UpdateOrderTableSchema,
  updateOrderExtraItems: UpdateOrderExtraItemsSchema,
  updateOrderShift: UpdateOrderShiftSchema,
  fixOrdersShift: NoContentSchema,
  updateOrderTablePpl: UpdateOrderTablePplSchema,
};

export type OrderSchemaInputs = SchemaInputs<typeof ORDER_SCHEMAS>;
