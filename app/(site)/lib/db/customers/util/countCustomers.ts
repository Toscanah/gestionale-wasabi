import prisma from "../../prisma";
import { CommonQueryFilter } from "../../../shared/schemas/common/filters/query";
import customerWhereQuery from "./customerWhereQuery";
import { Prisma } from "@/prisma/generated/client/client";

type CountCustomersArgs = { query: string | undefined } | { where: Prisma.CustomerWhereInput };

export default async function countCustomers(args: CountCustomersArgs): Promise<number> {
  const where = "where" in args ? args.where : customerWhereQuery({ query: args.query ?? "" });

  return prisma.customer.count({ where });
}
