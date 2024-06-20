import { Order } from "@prisma/client";
import prisma from "./../db";

export default async function createOrder() {
  // await prisma.order.deleteMany();
  // await prisma.product.deleteMany();

  // const a = await prisma.order.create({
  //   data: {
  //     type: "ASPORTO",
  //     total: 3259,
  //     products: { create: [{ name: "Magic" }, { name: "Butterflies" }] },
  //   },
  // });

  // const b = await prisma.order.findMany({
  //   include: {
  //     products: true,
  //   },
  // })
  return [];
  // return b;
}
