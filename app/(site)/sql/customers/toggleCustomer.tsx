import prisma from "../db";

export default async function toggleCustomer(id: number) {
  const customerId = id;
  const customer = await prisma.option.findUnique({ where: { id: customerId } });

  if (!customer) {
    return null;
  }

  return prisma.option.update({
    where: {
      id: customerId,
    },
    data: {
      active: !customer.active,
    },
  });
}
