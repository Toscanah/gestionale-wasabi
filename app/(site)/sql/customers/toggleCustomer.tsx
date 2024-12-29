import prisma from "../db";

export default async function toggleCustomer(id: number) {
  
  const customerId = id;
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });

  if (!customer) {
    return null;
  }

  return prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      active: !customer.active,
    },
  });
}
