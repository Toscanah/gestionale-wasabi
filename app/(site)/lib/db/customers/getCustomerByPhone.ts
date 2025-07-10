import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function getCustomerByPhone({
  phone,
}: {
  phone: string;
}): Promise<Customer | null> {
  const phoneRecord = await prisma.phone.findUnique({
    where: { phone },
    select: { customer: true },
  });

  return phoneRecord?.customer ?? null;
}
