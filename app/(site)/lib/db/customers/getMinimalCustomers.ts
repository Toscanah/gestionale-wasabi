import { Prisma } from "@prisma/client";
import { MinimalCustomer } from "../../shared";
import { CommonQueryFilter } from "../../shared/schemas/common/query";
import prisma from "../db";
import buildCustomerWhere from "./util/buildCustomerWhere";

type GetMinimalCustomersArgs = { query: CommonQueryFilter } | { where: Prisma.CustomerWhereInput };

export default async function getMinimalCustomers(
  args: GetMinimalCustomersArgs
): Promise<MinimalCustomer[]> {
  const where = "where" in args ? args.where : buildCustomerWhere(args.query);

  return await prisma.customer.findMany({
    where,
    select: {
      id: true,
      home_orders: {
        select: {
          id: true,
          order: {
            select: {
              id: true,
              type: true,
              created_at: true,
              discount: true,
              products: {
                select: {
                  quantity: true,
                  paid_quantity: true,
                  frozen_price: true,
                  status: true,
                  product: {
                    select: {
                      active: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      pickup_orders: {
        select: {
          id: true,
          order: {
            select: {
              id: true,
              type: true,
              created_at: true,
              discount: true,
              products: {
                select: {
                  quantity: true,
                  paid_quantity: true,
                  frozen_price: true,
                  status: true,
                  product: {
                    select: {
                      active: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
