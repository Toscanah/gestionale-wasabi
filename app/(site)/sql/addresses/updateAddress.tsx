import { Address } from "@prisma/client";
import prisma from "../db";

export default async function updateAddress(address: Address) {
  return await prisma.address.update({
    data: {
      ...address,
      cap: Number(address.cap),
    },
    where: {
      id: address.id,
    },
  });
}
