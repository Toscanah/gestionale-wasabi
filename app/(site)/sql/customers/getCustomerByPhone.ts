import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  return (
    (
      await prisma.phone.findUnique({
        where: { phone },
        select: { customer: true },
      })
    )?.customer || null
  );
}
