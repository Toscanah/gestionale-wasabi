import prisma from "../db";

export default async function getAddressesByCustomer(customerId: number) {
  return await prisma.address.findMany({
    where: {
      customer: {
        id: customerId,
      },
      temporary: false,
    },
  });
}
