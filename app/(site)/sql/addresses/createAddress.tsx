import { Address, Customer } from "@prisma/client";
import prisma from "../db";

export default async function createAddress(address: Address) {
  return await prisma.address.create({
    data: {
      ...address,
      cap: Number(address.cap),
    },
  });
}
