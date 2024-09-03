import { Customer, Phone } from "@prisma/client";
import prisma from "../db";
import { CustomerWithDetails } from "../../types/CustomerWithDetails";

export default async function updateCustomer(
  customer: CustomerWithDetails
): Promise<CustomerWithDetails> {
  let phoneId: number | null = customer.phone_id ?? null;

  console.log(customer);

  // Handle phone updates or creation
  if (phoneId) {
    // If phone_id exists, update the phone or delete it
    if (customer.phone?.phone !== undefined && customer.phone?.phone !== "") {
      // Update the existing phone record
      await prisma.phone.update({
        where: { id: phoneId },
        data: { phone: customer.phone.phone },
      });
    } else {
      // If no phone is provided or it's an empty string, delete the phone record and set phoneId to null
      await prisma.phone.delete({
        where: { id: phoneId },
      });
      phoneId = null;
    }
  } else {
    // Handle phone creation if a phone number is provided
    if (customer.phone?.phone) {
      const newPhone = await prisma.phone.create({
        data: { phone: customer.phone.phone },
      });
      phoneId = newPhone.id;
    }
  }

  // Update the customer record
  return await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      preferences: customer.preferences,
      phone_id: phoneId,
    },
    include: {
      phone: true,
      addresses: true,
    },
  });
}
