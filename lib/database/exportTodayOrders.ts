/**
 * Export TODAY's orders to JSON for AI analysis
 *
 * This function extracts all orders created today with comprehensive relations
 * to enable AI analysis of:
 * - Order capacity per hour
 * - Latency between expected time (when) vs arrival time (created_at)
 * - Correlation between delays and discounts
 *
 * Used via tRPC: trpc.orders.exportToday.useMutation()
 *
 * AI Analysis Guidelines:
 * - For HOME/PICKUP orders: Parse 'when' field (time like "20:30" or "immediate")
 *   and compare with created_at to calculate delivery latency
 * - Manual discount field may indicate service delays or customer complaints
 * - Group orders by hour (from created_at) to analyze capacity patterns
 * - Consider kitchen_type and product complexity for capacity modeling
 */

import { startOfDay, endOfDay } from "date-fns";
import prisma from "./prisma";
import { OrderStatus } from "@/prisma/generated/client/enums";

interface ExportedOrder {
  // Core order fields
  id: number;
  created_at: Date;
  updated_at: Date;
  type: string;
  status: string;
  shift: string;

  // Discount analysis fields
  discount: number; // Manual discount (may indicate service issues)

  // Timing fields for latency analysis
  when?: string; // Expected delivery time (for home/pickup orders)
  // Latency = difference between 'when' and 'created_at'

  // Order type specific details
  order_details: {
    // For TABLE orders
    table?: {
      table: string;
      res_name: string | null;
      people: number;
    };
    // For HOME orders
    home?: {
      when: string;
      planned_payment: string;
      prepaid: boolean;
      contact_phone: string | null;
      customer: {
        id: number;
        name: string | null;
        surname: string | null;
        phone: string;
        origin: string;
        order_notes: string | null;
      };
      address: {
        street: string;
        civic: string;
        doorbell: string;
        floor: string | null;
        stair: string | null;
        street_info: string | null;
      };
    };
    // For PICKUP orders
    pickup?: {
      when: string;
      name: string;
      planned_payment: string;
      prepaid: boolean;
      customer?: {
        id: number;
        name: string | null;
        surname: string | null;
        phone: string;
        origin: string;
      };
    };
  };

  // Products for order complexity analysis
  products: Array<{
    id: number;
    product_id: number;
    product_code: string;
    product_desc: string;
    quantity: number;
    paid_quantity: number;
    frozen_price: number;
    variation: string | null;
    created_at: Date;
    status: string;
    kitchen_type: string;
    category: string | null;
    // Options selected (affects preparation time)
    options: Array<{
      option_id: number;
      option_name: string;
    }>;
  }>;

  // Payment analysis
  payments: Array<{
    id: number;
    amount: number;
    type: string;
    scope: string;
    created_at: Date;
    payment_group_code: string | null;
  }>;

  // Promotion analysis (automatic discounts)
  promotions: Array<{
    promotion_id: number;
    promotion_code: string;
    promotion_type: string;
    amount: number;
    applied_at: Date;
  }>;

  // Rice metrics (kitchen capacity indicator)
  rices: number | null;
  salads: number | null;
  soups: number | null;
}

export default async function exportTodayOrders() {
  const today = new Date();
  // Hard override to export orders for 30 January 2026
  const overrideDate = new Date(2026, 1, 27); // year, monthIndex (0 = Jan), day
  const dayStart = startOfDay(overrideDate);
  const dayEnd = endOfDay(overrideDate);
  // Fetch all orders created today with comprehensive relations
  const orders = await prisma.order.findMany({
    where: {
      created_at: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: OrderStatus.PAID,
      suborder_of: null,
    },
    include: {
      // Table order details
      table_order: true,

      // Home order details with customer and address
      home_order: {
        include: {
          customer: {
            include: {
              phone: true,
            },
          },
          address: true,
        },
      },

      // Pickup order details with optional customer
      pickup_order: {
        include: {
          customer: {
            include: {
              phone: true,
            },
          },
        },
      },

      // Products with options and category
      products: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      },

      // Payment history
      payments: {
        orderBy: {
          created_at: "asc",
        },
      },

      // Promotions applied
      promotion_usages: {
        include: {
          promotion: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  // Transform to analysis-friendly format
  const exportedOrders: ExportedOrder[] = orders.map((order) => {
    // Determine 'when' field based on order type
    let whenValue: string | undefined = undefined;

    if (order.home_order) {
      whenValue = order.home_order.when;
    } else if (order.pickup_order) {
      whenValue = order.pickup_order.when;
    }

    return {
      id: order.id,
      created_at: order.created_at,
      updated_at: order.updated_at,
      type: order.type,
      status: order.status,
      shift: order.shift,
      discount: order.discount,
      when: whenValue,
      rices: order.rices,
      salads: order.salads,
      soups: order.soups,

      order_details: {
        table: order.table_order
          ? {
              table: order.table_order.table,
              res_name: order.table_order.res_name,
              people: order.table_order.people,
            }
          : undefined,

        home: order.home_order
          ? {
              when: order.home_order.when,
              planned_payment: order.home_order.planned_payment,
              prepaid: order.home_order.prepaid,
              contact_phone: order.home_order.contact_phone,
              customer: {
                id: order.home_order.customer.id,
                name: order.home_order.customer.name,
                surname: order.home_order.customer.surname,
                phone: order.home_order.customer.phone.phone,
                origin: order.home_order.customer.origin,
                order_notes: order.home_order.customer.order_notes,
              },
              address: {
                street: order.home_order.address.street,
                civic: order.home_order.address.civic,
                doorbell: order.home_order.address.doorbell,
                floor: order.home_order.address.floor,
                stair: order.home_order.address.stair,
                street_info: order.home_order.address.street_info,
              },
            }
          : undefined,

        pickup: order.pickup_order
          ? {
              when: order.pickup_order.when,
              name: order.pickup_order.name,
              planned_payment: order.pickup_order.planned_payment,
              prepaid: order.pickup_order.prepaid,
              customer: order.pickup_order.customer
                ? {
                    id: order.pickup_order.customer.id,
                    name: order.pickup_order.customer.name,
                    surname: order.pickup_order.customer.surname,
                    phone: order.pickup_order.customer.phone.phone,
                    origin: order.pickup_order.customer.origin,
                  }
                : undefined,
            }
          : undefined,
      },

      products: order.products.map((p) => ({
        id: p.id,
        product_id: p.product_id,
        product_code: p.product.code,
        product_desc: p.product.desc,
        quantity: p.quantity,
        paid_quantity: p.paid_quantity ?? 0,
        frozen_price: p.frozen_price,
        variation: p.variation,
        created_at: p.created_at,
        status: p.status,
        kitchen_type: p.product.kitchen,
        category: p.product.category?.category ?? null,
        options: p.options.map((o) => ({
          option_id: o.option_id,
          option_name: o.option.option_name,
        })),
      })),

      payments: order.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        type: p.type,
        scope: p.scope,
        created_at: p.created_at,
        payment_group_code: p.payment_group_code,
      })),

      promotions: order.promotion_usages.map((pu) => ({
        promotion_id: pu.promotion_id,
        promotion_code: pu.promotion.code,
        promotion_type: pu.promotion.type,
        amount: pu.amount,
        applied_at: pu.created_at,
      })),
    };
  });

  // Calculate statistics
  const stats = {
    export_timestamp: new Date().toISOString(),
    date_range: {
      from: dayStart.toISOString(),
      to: dayEnd.toISOString(),
    },
    total_orders: exportedOrders.length,
    orders_by_type: {
      TABLE: exportedOrders.filter((o) => o.type === "TABLE").length,
      HOME: exportedOrders.filter((o) => o.type === "HOME").length,
      PICKUP: exportedOrders.filter((o) => o.type === "PICKUP").length,
    },
    orders_by_shift: {
      UNSPECIFIED: exportedOrders.filter((o) => o.shift === "UNSPECIFIED").length,
      LUNCH: exportedOrders.filter((o) => o.shift === "LUNCH").length,
      DINNER: exportedOrders.filter((o) => o.shift === "DINNER").length,
    },
    orders_with_manual_discount: exportedOrders.filter((o) => o.discount > 0).length,
    orders_with_promotions: exportedOrders.filter((o) => o.promotions.length > 0).length,
    total_manual_discount_amount: exportedOrders.reduce((sum, o) => sum + o.discount, 0),
    total_promotion_discount_amount: exportedOrders.reduce(
      (sum, o) => sum + o.promotions.reduce((pSum, p) => pSum + p.amount, 0),
      0,
    ),
  };

  // Return export data
  return {
    metadata: {
      ...stats,
      notes: "Export for AI analysis of order capacity and latency correlation with discounts",
      latency_calculation: "For HOME and PICKUP orders, compare 'when' field with 'created_at'",
      capacity_analysis: "Group by hour from created_at to calculate orders per hour",
    },
    orders: exportedOrders,
  };
}
