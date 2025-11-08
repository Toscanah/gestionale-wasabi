import { CustomerContracts } from "../../shared";
import prisma from "../prisma";

export default async function toggleCustomer({
  id,
}: CustomerContracts.Toggle.Input): Promise<CustomerContracts.Toggle.Output> {
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return prisma.customer.update({
    where: {
      id,
    },
    data: {
      active: !customer.active,
    },
    select: { id: true, active: true },
  });
}
