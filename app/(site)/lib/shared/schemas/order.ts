import { OrderType, PlannedPayment, WorkingShift } from "@prisma/client";
import { z } from "zod";
import {
  AnyOrderSchema,
  OrderWithPaymentsAndTotalsSchema,
  ProductInOrderWithOptionsSchema,
} from "../models/_index";
import { ApiContract } from "../types/api-contract";
import { NoContentRequestSchema } from "./common/no-content";
import { wrapSchema } from "./common/utils";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";
import { ShiftFilterValue } from "../enums/shift";
import { PeriodRequestSchema } from "./common/period";

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

export const GetOrdersWithPaymentsRequestSchema = z
  .object({
    filters: z.object({
      orderTypes: z.array(z.nativeEnum(OrderType)).optional(), // optional = ALL types
      shift: z.nativeEnum(ShiftFilterValue).optional(), // LUNCH, DINNER, undefined = ALL shifts
      period: PeriodRequestSchema, // undefined = since forever. If from=to, single date
      weekdays: z.array(z.number()).optional(), // 0–6, undefined = all
      timeWindow: z
        .object({
          from: z.string(), // "HH:mm"
          to: z.string(),
        })
        .optional(), // undefined = all day
      query: z.string().optional(),
    }),
    summary: z.boolean().optional(),
  })
  .merge(PaginationRequestSchema.partial());

export const UpdateOrdersShiftSchema = NoContentRequestSchema;

export const ORDER_REQUESTS = {
  cancelOrder: CancelOrderSchema,
  cancelOrdersInBulk: CancelOrdersInBulkSchema,
  createHomeOrder: CreateHomeOrderSchema,
  createPickupOrder: CreatePickupOrderSchema,
  createSubOrder: CreateSubOrderSchema,
  createTableOrder: CreateTableOrderSchema,
  deleteEverything: NoContentRequestSchema,
  fixOrdersShift: NoContentRequestSchema,
  getOrderById: GetOrderByIdSchema,
  getOrdersByType: GetOrdersByTypeSchema,
  getOrdersWithPayments: GetOrdersWithPaymentsRequestSchema,
  joinTableOrders: JoinTableOrdersSchema,
  updateOrderDiscount: UpdateOrderDiscountSchema,
  updateOrderExtraItems: UpdateOrderExtraItemsSchema,
  updateOrderPaymentStatus: UpdateOrderPaymentStatusSchema,
  updateOrderPrintedFlag: UpdateOrderPrintedFlagSchema,
  updateOrderShift: UpdateOrderShiftSchema,
  updateOrdersShift: UpdateOrdersShiftSchema,
  updateOrderTable: UpdateOrderTableSchema,
  updateOrderTablePpl: UpdateOrderTablePplSchema,
  updateOrderTime: UpdateOrderTimeSchema,
};

export const GetOrdersWithPaymentsResponseSchema = z
  .object({
    orders: z.array(OrderWithPaymentsAndTotalsSchema),
  })
  .merge(PaginationResponseSchema);

export const ORDER_RESPONSES = {
  getOrdersWithPayments: GetOrdersWithPaymentsResponseSchema,
};

export type OrderContract = ApiContract<typeof ORDER_REQUESTS, typeof ORDER_RESPONSES>;
