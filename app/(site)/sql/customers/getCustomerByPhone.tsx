import prisma from "../db";

export default async function getCustomerByPhone(phone: string) {
  return await prisma.customer.findFirst({
    where: {
      phone: {
        some: {
          phone: phone,
        },
      },
    },
    include: {
      addresses: true,
    },
  });
}
