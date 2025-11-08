import prisma from "../prisma";
import { CustomerContracts } from "../../shared";

export default async function getCustomerByPhone({
  phone,
}: CustomerContracts.GetByPhone.Input): Promise<CustomerContracts.GetByPhone.Output> {
  const phoneRecord = await prisma.phone.findUnique({
    where: { phone },
    select: { customer: true },
  });

  if (!phoneRecord || !phoneRecord.customer) {
    return null;
  }

  return phoneRecord.customer;
}
