import prisma from "../db";
import { CreateCustomerInput, CustomerWithDetails } from "@/app/(site)/lib/shared";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";
import normalizeTemplatePayload from "../../formatting-parsing/engagement/normalizeTemplatePayload";

export default async function createCustomer({
  customer,
}: {
  customer: CreateCustomerInput;
}): Promise<CustomerWithDetails | null> {
  return await prisma.$transaction(async (tx) => {
    const { phone, ...customerData } = customer;

    const phoneExists = await tx.phone.findUnique({
      where: { phone },
    });

    if (phoneExists) {
      return null;
    }

    const newPhone = await tx.phone.create({
      data: { phone },
    });

    return await tx.customer.create({
      data: {
        ...customerData,
        phone_id: newPhone.id,
      },
      include: {
        phone: true,
        addresses: true,
        ...homeAndPickupOrdersInclude,
        ...engagementsInclude,
      },
    });
  });
}
