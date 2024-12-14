import { Option } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function getAllOptions(): Promise<Option[]> {
  return await prisma.option.findMany();
}
