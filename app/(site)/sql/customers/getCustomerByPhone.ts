import prisma from "../db";

export default async function getCustomerByPhone(phone: string) {
  return await prisma.customer.findFirst({
    where: { phone: { phone } },
  });
}
