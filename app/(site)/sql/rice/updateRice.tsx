import { Rice } from "@prisma/client";
import prisma from "../db";

export default async function updateRice(rice: Rice) {
  return await prisma.rice.update({
    data: { ...rice },
    where: { id: 1 },
  });
}
