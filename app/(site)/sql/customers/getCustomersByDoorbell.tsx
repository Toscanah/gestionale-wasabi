import prisma from "../db";

export default async function getCustomersByDoorbell(doorbell: string) {
  const customers = await prisma.customer.findMany({
    where: {
      addresses: {
        some: {
          doorbell: doorbell.toLocaleLowerCase(),
        },
      },
    },
    include: {
      addresses: true,
      phone: true,
    },
  });

  return customers;
}
