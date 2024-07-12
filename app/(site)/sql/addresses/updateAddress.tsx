import { Address } from "@prisma/client";
import prisma from "../db";

export default async function updateAddress(data: { address: Address }) {
  const { address } = data;

  return {
    address: await prisma.address.update({
      data: {
        ...address,
        cap: Number(address.cap),
      },
      where: {
        id: address.id,
      },
    }),
    customer: await prisma.customer.findUnique({
      where: { id: address.customer_id },
      include: {
        addresses: true,
      },
    }),
  };
}
