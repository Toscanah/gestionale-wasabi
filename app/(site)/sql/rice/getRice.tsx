import { Rice } from "@prisma/client";
import prisma from "../db";

export default async function getRice(): Promise<Rice | null> {
  const rice = await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });

  return rice ? rice : {id: 1, amount: 0, threshold: 0}
}
