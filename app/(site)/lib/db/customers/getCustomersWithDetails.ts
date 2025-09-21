import {
  CustomerContracts,
  ComprehensiveCustomer,
  ShiftFilterValue,
} from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, orderInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import customerWhereQuery from "./util/customerWhereQuery";
import { EngagementType, OrderStatus, Prisma } from "@prisma/client";

export default async function getCustomersWithDetails(
  input: CustomerContracts.GetAllWithDetails.Input
): Promise<CustomerContracts.GetAllWithDetails.Output> {
  const { filters, pagination } = input ?? {};

  const { page, pageSize } = pagination || {};
  const { query, engagementTypes } = filters || {};

  const { period, shift } = filters?.orders || {};

  const normalizedPeriod = normalizePeriod(period);

  const orderWhere: Prisma.OrderWhereInput = {
    ...(shift && shift !== ShiftFilterValue.ALL ? { shift } : {}),
    ...(normalizedPeriod?.from || normalizedPeriod?.to
      ? {
          created_at: {
            ...(normalizedPeriod?.from ? { gte: normalizedPeriod.from } : {}),
            ...(normalizedPeriod?.to ? { lte: normalizedPeriod.to } : {}),
          },
        }
      : {}),
  };

  const orderFilterActive =
    (!!shift && shift !== ShiftFilterValue.ALL) ||
    !!normalizedPeriod?.from ||
    !!normalizedPeriod?.to;

  const queryFilter = customerWhereQuery({ query: query ?? "" });

  const andFilters: Prisma.CustomerWhereInput[] = [];

  // engagement filter
  if (engagementTypes?.length && engagementTypes.length < Object.values(EngagementType).length) {
    andFilters.push({
      engagements: {
        some: { template: { type: { in: engagementTypes } } },
      },
    });
  }

  // query filter
  if (queryFilter.OR) {
    andFilters.push({ OR: queryFilter.OR });
  }

  // order filter
  if (orderFilterActive) {
    andFilters.push({
      OR: [
        { home_orders: { some: { order: orderWhere } } },
        { pickup_orders: { some: { order: orderWhere } } },
      ],
    });
  }

  const baseWhere: Prisma.CustomerWhereInput = andFilters.length > 0 ? { AND: andFilters } : {};

  // --- DB query ---
  const customers: ComprehensiveCustomer[] = await prisma.customer.findMany({
    skip: page !== undefined && pageSize !== undefined ? page * pageSize : undefined,
    take: pageSize,
    where: baseWhere,
    include: {
      addresses: true,
      phone: true,
      home_orders: {
        where: {
          order: {
            ...orderWhere,
            status: OrderStatus.PAID,
          },
        },
        include: orderInclude,
      },
      pickup_orders: {
        where: {
          order: {
            ...orderWhere,
            status: OrderStatus.PAID,
          },
        },
        include: orderInclude,
      },
      ...engagementsInclude,
    },
  });

  // --- Count query ---
  const totalCount = await prisma.customer.count({
    where: baseWhere,
  });

  return {
    customers: customers.map(filterInactiveProducts),
    totalCount,
  };
}
