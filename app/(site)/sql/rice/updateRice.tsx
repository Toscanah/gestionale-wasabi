import { Rice } from "@prisma/client";
import prisma from "../db";

export default async function updateRice(rice: Rice) {
  return await prisma.rice.update({
    data: {
      id: 1,
      amount: rice.amount ?? 0,
      threshold: rice.threshold ?? 0,
    },
    where: { id: 1 },
  });
}
