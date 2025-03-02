import prisma from "../db";

export default async function sendMarketingToCustomers(customerIds: number[], marketingId: number) {
  if (customerIds.length === 0) {
    throw new Error("No customers selected for marketing.");
  }

  const marketingExists = await prisma.marketingTemplate.findUnique({
    where: { id: marketingId },
  });

  if (!marketingExists) {
    throw new Error(`Marketing template with ID ${marketingId} does not exist.`);
  }

  const existingCustomers = await prisma.customer.findMany({
    where: { id: { in: customerIds } },
    select: { id: true },
  });

  const existingCustomerIds = existingCustomers.map((c) => c.id);
  const missingCustomers = customerIds.filter((id) => !existingCustomerIds.includes(id));

  if (missingCustomers.length > 0) {
    throw new Error(`Some customers do not exist: ${missingCustomers.join(", ")}`);
  }

  const marketingRecords = existingCustomerIds.map((customerId) => ({
    customer_id: customerId,
    marketing_id: marketingId,
  }));

  await prisma.marketingOnCustomer.createMany({
    data: marketingRecords,
    skipDuplicates: true,
  });

  return true;
}
