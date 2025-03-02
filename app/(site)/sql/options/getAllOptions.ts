import { Option } from "@prisma/client";
import prisma from "../db";

export default async function getAllOptions(): Promise<Option[]> {
  return await prisma.option.findMany();
}
