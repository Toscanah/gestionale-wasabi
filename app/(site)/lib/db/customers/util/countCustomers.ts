import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { CommonQueryFilter } from "../../../shared/schemas/common/filters/query";
import customerWhereQuery from "./customerWhereQuery";

type CountCustomersArgs = { query: string | undefined } | { where: Prisma.CustomerWhereInput };

export default async function countCustomers(args: CountCustomersArgs): Promise<number> {
  const where = "where" in args ? args.where : customerWhereQuery({ query: args.query ?? "" });

  return prisma.customer.count({ where });
}
