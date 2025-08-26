import { CustomerSchemaInputs } from "../../../shared";
import prisma from "../../db";
import buildCustomerWhere from "./buildCustomerWhere";

export default async function countCustomers(
  filters?: CustomerSchemaInputs["GetCustomersWithDetailsInput"]["filters"]
): Promise<number> {
  return await prisma.customer.count({ where: buildCustomerWhere(filters) });
}
