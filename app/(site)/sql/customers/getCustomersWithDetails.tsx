import prisma from "../db";

export default async function getCustomersWithDetails() {
  const customer = await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
    },
  });

  return customer.map((customer) => ({
    ...customer,
    email: customer.email ? customer.email : "",
    phone: customer.phone ? customer.phone.phone : "",
  }));
}
