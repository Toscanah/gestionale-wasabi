import { CustomerContracts, ComprehensiveCustomer, ShiftFilterValue } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { engagementsInclude, orderInclude, productsInOrderInclude } from "../includes";
import filterInactiveProducts from "../../services/product-management/filterInactiveProducts";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import customerWhereQuery from "./util/customerWhereQuery";
import { OrderStatus, Prisma, WorkingShift } from "@prisma/client";

export default async function getCustomersWithDetails(
  input: CustomerContracts.GetAllWithDetails.Input
): Promise<CustomerContracts.GetAllWithDetails.Output> {
  const { filters, pagination } = input ?? {};
  const { page, pageSize } = pagination || {};
  const { period, shift } = filters?.orders || {};
  const normalizedPeriod = normalizePeriod(period);

  const orderWhere: Prisma.OrderWhereInput = {
    ...(shift && shift !== ShiftFilterValue.ALL ? { shift } : {}),
    ...(normalizedPeriod?.from ? { created_at: { gte: normalizedPeriod.from } } : {}),
    ...(normalizedPeriod?.to ? { created_at: { lte: normalizedPeriod.to } } : {}),
  };

  // 👇 Only add the OR if we actually have filters (period or shift)
  const orderFilterActive =
    (!!shift && shift !== ShiftFilterValue.ALL) ||
    !!normalizedPeriod?.from ||
    !!normalizedPeriod?.to;

  const customers: ComprehensiveCustomer[] = await prisma.customer.findMany({
    skip: page !== undefined && pageSize !== undefined ? page * pageSize : undefined,
    take: pageSize,
    where: {
      ...customerWhereQuery({ query: filters?.query ?? "" }),
      ...(orderFilterActive
        ? {
            OR: [
              { home_orders: { some: { order: orderWhere } } },
              { pickup_orders: { some: { order: orderWhere } } },
            ],
          }
        : {}),
    },
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

  return customers.map(filterInactiveProducts);
}
