import prisma from "../db";

export default async function toggleCustomer(id: number) {
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) {
    return null;
  }

  return prisma.customer.update({
    where: {
      id,
    },
    data: {
      active: !customer.active,
    },
  });
}
