import { Customer } from "@prisma/client";
import prisma from "../db";

export default async function createCustomer(data: { customer: Customer; phone: string }) {
  const { phone, customer } = data;

  const existingPhone = await prisma.phone.findFirst({
    where: { phone },
  });

  let phoneId: number;

  if (existingPhone) {
    // If the phone exists, use its ID
    phoneId = existingPhone.id;
  } else {
    // Otherwise, create a new phone record
    const newPhone = await prisma.phone.create({
      data: { phone },
    });
    phoneId = newPhone.id;
  }

  return await prisma.customer.create({
    data: {
      ...customer,
      phone_id: phoneId,
    },
  });
}
