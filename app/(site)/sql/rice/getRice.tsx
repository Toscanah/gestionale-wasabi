import { Rice } from "@prisma/client";
import prisma from "../db";

export default async function getRice(): Promise<Rice | null> {
  return await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });
}
