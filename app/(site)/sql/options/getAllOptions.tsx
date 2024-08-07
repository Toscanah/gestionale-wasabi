import prisma from "../db";

export default async function getAllOptions() {
  return await prisma.option.findMany();
}