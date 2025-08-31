import { CustomerContract } from "../../../shared";
import prisma from "../../db";
import buildCustomerWhere from "./buildCustomerWhere";

export default async function countCustomers(
  filters?: CustomerContract["Requests"]["GetCustomersWithDetails"]["filters"]
): Promise<number> {
  return await prisma.customer.count({ where: buildCustomerWhere(filters) });
}
