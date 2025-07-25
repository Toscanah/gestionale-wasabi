import { OrderType, QuickPaymentOption, WorkingShift } from "@prisma/client";
import { z } from "zod";
import { NoContentSchema, wrapSchema } from "./common";
import { AnyOrderSchema, ProductInOrderWithOptionsSchema } from "../models/_index";

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
  notes: z.string(),
  contactPhone: z.string(),
});

export const CreateSubOrderSchema = z.object({
  parentOrder: AnyOrderSchema,
  products: z.array(ProductInOrderWithOptionsSchema),
  isReceiptPrinted: z.boolean(),
});

export type CreateSubOrderInput = z.infer<typeof CreateSubOrderSchema>;

export const UpdateOrderDiscountSchema = z.object({
  orderId: z.number(),
  discount: z.number().optional(),
});

export const UpdateOrderNotesSchema = z.object({
  orderId: z.number(),
  notes: z.string(),
});

export const UpdateOrderPaymentSchema = z.object({
  orderId: z.number(),
  payment: z.nativeEnum(QuickPaymentOption),
});

export const UpdateOrderTimeSchema = z.object({
  time: z.string(),
  orderId: z.number(),
});

export const UpdatePrintedFlagSchema = wrapSchema("orderId", z.number());

export const JoinTableOrdersSchema = z.object({
  tableToJoin: z.string(),
  originalOrderId: z.number(),
});

export const UpdateTableSchema = z.object({
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
  ordersId: z.array(z.number()),
  productsCooked: z.boolean(),
});

export const UpdateTablePplSchema = z.object({
  orderId: z.number(),
  people: z.number(),
});

export type UpdateTablePplInput = z.infer<typeof UpdateTablePplSchema>;

export const ORDER_SCHEMAS = {
  getOrderById: GetOrderByIdSchema,
  getOrdersByType: GetOrdersByTypeSchema,
  updateOrderDiscount: UpdateOrderDiscountSchema,
  updateOrderNotes: UpdateOrderNotesSchema,
  updateOrderPayment: UpdateOrderPaymentSchema,
  createTableOrder: CreateTableOrderSchema,
  createPickupOrder: CreatePickupOrderSchema,
  createHomeOrder: CreateHomeOrderSchema,
  updateOrderTime: UpdateOrderTimeSchema,
  cancelOrder: CancelOrderSchema,
  createSubOrder: CreateSubOrderSchema,
  updatePrintedFlag: UpdatePrintedFlagSchema,
  cancelOrdersInBulk: CancelOrdersInBulkSchema,
  deleteEverything: NoContentSchema,
  joinTableOrders: JoinTableOrdersSchema,
  updateTable: UpdateTableSchema,
  updateOrderExtraItems: UpdateOrderExtraItemsSchema,
  updateOrderShift: UpdateOrderShiftSchema,
  fixOrdersShift: NoContentSchema,
  updateTablePpl: UpdateTablePplSchema,
};
