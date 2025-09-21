import { OrderType, PlannedPayment, WorkingShift } from "@prisma/client";
import { z } from "zod";
import {
  AnyOrderSchema,
  HomeOrderInOrderSchema,
  OrderWithSummedPayments,
  PickupOrderInOrderSchema,
  ProductInOrderWithOptionsSchema,
  TableOrderInOrderSchema,
} from "../models/_index";
import { NoContentRequestSchema } from "./common/no-content";
import { wrapSchema } from "./common/utils";
import { PaginationSchema, PaginationResponseSchema } from "./common/pagination";
import { OrdersStats } from "./results/order-stats";
import { APIFiltersSchema, wrapFilters } from "./common/filters/filters";

export namespace OrderContracts {
  export namespace Common {
    export const AnyOrder = AnyOrderSchema;
    export type AnyOrder = z.infer<typeof AnyOrder>;

    export const TableOrder = TableOrderInOrderSchema;
    export type TableOrder = z.infer<typeof TableOrder>;

    export const HomeOrder = HomeOrderInOrderSchema;
    export type HomeOrder = z.infer<typeof HomeOrder>;

    export const PickupOrder = PickupOrderInOrderSchema;
    export type PickupOrder = z.infer<typeof PickupOrder>;

    export const NoContentInput = NoContentRequestSchema;
    export type NoContentInput = z.infer<typeof NoContentInput>;
  }

  export namespace GetById {
    export const Input = z.object({
      orderId: z.number(),
      variant: z.string().default("onlyPaid").optional(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace GetHomeOrders {
    export const Input = Common.NoContentInput;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.HomeOrder);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetPickupOrders {
    export const Input = Common.NoContentInput;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.PickupOrder);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetTableOrders {
    export const Input = Common.NoContentInput;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.TableOrder);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetWithPayments {
    export const Input = wrapFilters(
      APIFiltersSchema.omit({
        weekdays: true,
        timeWindow: true,
      })
    )
      .extend(PaginationSchema.shape)
      .partial()
      .optional();
    export type Input = z.infer<typeof Input>;

    export const Output = z
      .object({
        orders: z.array(OrderWithSummedPayments),
      })
      .and(PaginationResponseSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace CreateTable {
    export const Input = z.object({
      table: z.string(),
      people: z.number(),
      resName: z.string().optional(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      order: Common.TableOrder,
      isNewOrder: z.boolean(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace CreatePickup {
    export const Input = z.object({
      name: z.string(),
      when: z.string(),
      phone: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      order: PickupOrderInOrderSchema,
      isNewOrder: z.boolean(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace CreateHome {
    export const Input = z.object({
      customerId: z.number(),
      addressId: z.number(),
      contactPhone: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = HomeOrderInOrderSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace CreateSub {
    export const Input = z.object({
      parentOrder: Common.AnyOrder,
      products: z.array(ProductInOrderWithOptionsSchema),
      isReceiptPrinted: z.boolean(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace UpdateDiscount {
    export const Input = z.object({
      orderId: z.number(),
      discount: z.number().optional(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace UpdatePaymentStatus {
    export const Input = z.object({
      orderId: z.number(),
      prepaid: z.boolean(),
      plannedPayment: z.enum(PlannedPayment),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace UpdateTime {
    export const Input = z.object({
      orderId: z.number(),
      time: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace UpdatePrintedFlag {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      isReceiptPrinted: z.literal(true),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateTable {
    export const Input = z.object({
      table: z.string(),
      orderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.TableOrder;
    export type Output = Common.TableOrder;
  }

  export namespace UpdateExtraItems {
    export const Input = z.object({
      orderId: z.number(),
      items: z.enum(["salads", "soups", "rices"]),
      value: z.number().nullable(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace UpdateShift {
    export const Input = z.object({
      orderId: z.number(),
      shift: z.enum(WorkingShift),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateTablePpl {
    export const Input = z.object({
      orderId: z.number(),
      people: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.TableOrder;
    export type Output = Common.TableOrder;
  }

  export namespace Cancel {
    export const Input = z.object({
      orderId: z.number(),
      cooked: z.boolean().optional().default(false),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.AnyOrder;
    export type Output = Common.AnyOrder;
  }

  export namespace CancelInBulk {
    export const Input = z.object({
      orderIds: z.array(z.number()),
      productsCooked: z.boolean(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(
      z.object({
        orderId: z.number(),
        type: z.enum(OrderType),
      })
    );
    export type Output = z.infer<typeof Output>;
  }

  export namespace JoinTables {
    export const Input = z.object({
      tableToJoin: z.string(),
      originalOrderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      updatedOrder: Common.TableOrder,
      joinedTable: Common.TableOrder,
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace FixShift {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;
  }

  export namespace UpdateOrdersShift {
    export const Input = Common.NoContentInput;
    export type Input = Common.NoContentInput;

    export const Output = z.array(
      z.object({
        orderId: z.number(),
        updatedShift: z.enum(WorkingShift),
      })
    );
    export type Output = z.infer<typeof Output>;
  }

  export namespace ComputeStats {
    export const Input = wrapFilters(
      APIFiltersSchema.omit({
        orderTypes: true,
        query: true,
      })
    )
      .partial()
      .optional();

    export type Input = z.infer<typeof Input>;

    export const Output = OrdersStats.Results;
    export type Output = z.infer<typeof Output>;
  }
}
