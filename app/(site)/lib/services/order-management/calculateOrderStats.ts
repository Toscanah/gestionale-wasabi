import { OrderStatsResults } from "@/app/(site)/hooks/statistics/useOrdersStats";
import { AnyOrder, ProductInOrder } from "../../shared";
import { OrderType, ProductInOrderStatus } from "@prisma/client";
import getPioRice from "../product-management/getPioRice";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, endOfDay, startOfDay } from "date-fns";

export default function calculateResults(
  orders: AnyOrder[],
  period?: DateRange
): OrderStatsResults {
  // Accumulators
  let homeOrders = 0,
    pickupOrders = 0,
    tableOrders = 0;

  let homeRevenue = 0,
    pickupRevenue = 0,
    tableRevenue = 0;

  let homeSoups = 0,
    homeRices = 0,
    homeSalads = 0;
  let pickupSoups = 0,
    pickupRices = 0,
    pickupSalads = 0;
  let tableSoups = 0,
    tableRices = 0,
    tableSalads = 0;

  let homeProducts = 0,
    pickupProducts = 0,
    tableProducts = 0;

  // Total rice mass (e.g., grams) per order type
  let homeRice = 0,
    pickupRice = 0,
    tableRice = 0;

  // Helpers
  const computeLineRevenue = (pio: ProductInOrder) => {
    const paidQty = pio.paid_quantity ?? 0;
    const price = pio.frozen_price ?? 0;
    return paidQty > 0 ? paidQty * price : 0;
  };

  const computeOrderRiceMass = (order: AnyOrder) => {
    if (!Array.isArray(order.products)) return 0;

    let riceMass = 0;

    for (const pio of order.products) {
      const isCooked =
        pio.status === ProductInOrderStatus.IN_ORDER ||
        pio.status === ProductInOrderStatus.DELETED_COOKED;
      const paidQty = pio.paid_quantity ?? 0;

      if (isCooked && paidQty > 0) {
        riceMass += getPioRice(pio);
      }
    }

    return riceMass;
  };

  const computeCategoryCountsFromPIOs = (order: AnyOrder) => {
    // Derive counts from product definition * ordered quantity *
    if (!Array.isArray(order.products) || order.products.length === 0) {
      return { soups: 0, rices: 0, salads: 0 };
    }

    let soups = 0,
      rices = 0,
      salads = 0;

    for (const pio of order.products) {
      const qty = pio.quantity ?? 0;
      const prod = pio.product;
      soups += (prod.soups ?? 0) * qty;
      rices += (prod.rices ?? 0) * qty;
      salads += (prod.salads ?? 0) * qty;
    }

    return { soups, rices, salads };
  };

  for (const order of orders) {
    // --- Revenue (paid items only) ---
    let orderRevenue = 0;
    let productCount = 0;
    if (Array.isArray(order.products)) {
      for (const pio of order.products) {
        orderRevenue += computeLineRevenue(pio);
        const qty = pio.paid_quantity ?? 0;
        if (qty > 0) {
          productCount += qty;
        }
      }
    }

    // --- Category counts (soups/rices/salads) ---
    // Rule: if order-level value is present and != 0, use it; otherwise derive from PIOs.
    const derived = computeCategoryCountsFromPIOs(order);

    const orderSoups = order.soups && order.soups !== 0 ? order.soups : derived.soups;
    const orderRices = order.rices && order.rices !== 0 ? order.rices : derived.rices;
    const orderSalads = order.salads && order.salads !== 0 ? order.salads : derived.salads;

    // --- Rice mass (grams) from cooked + paid lines ---
    const orderRiceMass = computeOrderRiceMass(order);

    // --- Accumulate by type ---
    switch (order.type as OrderType) {
      case OrderType.HOME:
        homeOrders += 1;
        homeRevenue += orderRevenue;
        homeSoups += orderSoups;
        homeRices += orderRices;
        homeSalads += orderSalads;
        homeRice += orderRiceMass;
        homeProducts += productCount;
        break;

      case OrderType.PICKUP:
        pickupOrders += 1;
        pickupRevenue += orderRevenue;
        pickupSoups += orderSoups;
        pickupRices += orderRices;
        pickupSalads += orderSalads;
        pickupRice += orderRiceMass;
        pickupProducts += productCount;
        break;

      case OrderType.TABLE:
        tableOrders += 1;
        tableRevenue += orderRevenue;
        tableSoups += orderSoups;
        tableRices += orderRices;
        tableSalads += orderSalads;
        tableRice += orderRiceMass;
        tableProducts += productCount;
        break;
    }
  }

  let numDays = 1; // fallback = 1 day (avoid division by zero)

  const from = period?.from ? new Date(period.from) : startOfDay(new Date(2025, 0, 1));
  const to = period?.to ? new Date(period.to) : endOfDay(new Date());

  numDays = differenceInCalendarDays(to, from) + 1;

  return {
    // Home
    homeOrders,
    homeRevenue,
    homeSoups,
    homeRices,
    homeSalads,
    homeRice,
    homeProducts,

    // Pickup
    pickupOrders,
    pickupRevenue,
    pickupSoups,
    pickupRices,
    pickupSalads,
    pickupRice,
    pickupProducts,

    // Table
    tableOrders,
    tableRevenue,
    tableSoups,
    tableRices,
    tableSalads,
    tableRice,
    tableProducts,

    // ---- Averages per day ----
    homeOrdersPerDay: homeOrders / numDays,
    homeRevenuePerDay: homeRevenue / numDays,
    homeProductsPerDay: homeProducts / numDays,

    pickupOrdersPerDay: pickupOrders / numDays,
    pickupRevenuePerDay: pickupRevenue / numDays,
    pickupProductsPerDay: pickupProducts / numDays,

    tableOrdersPerDay: tableOrders / numDays,
    tableRevenuePerDay: tableRevenue / numDays,
    tableProductsPerDay: tableProducts / numDays,

    // ---- Averages per order ----
    homeRevenuePerOrder: homeOrders > 0 ? homeRevenue / homeOrders : 0,
    pickupRevenuePerOrder: pickupOrders > 0 ? pickupRevenue / pickupOrders : 0,
    tableRevenuePerOrder: tableOrders > 0 ? tableRevenue / tableOrders : 0,

    // ---- Averages per day (extra categories) ----
    homeSoupsPerDay: homeSoups / numDays,
    homeRicesPerDay: homeRices / numDays,
    homeSaladsPerDay: homeSalads / numDays,
    homeRiceMassPerDay: homeRice / numDays,

    pickupSoupsPerDay: pickupSoups / numDays,
    pickupRicesPerDay: pickupRices / numDays,
    pickupSaladsPerDay: pickupSalads / numDays,
    pickupRiceMassPerDay: pickupRice / numDays,

    tableSoupsPerDay: tableSoups / numDays,
    tableRicesPerDay: tableRices / numDays,
    tableSaladsPerDay: tableSalads / numDays,
    tableRiceMassPerDay: tableRice / numDays,
  };
}
