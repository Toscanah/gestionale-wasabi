import prisma from "../db";

export default async function getTables() {
  return await prisma.table.findMany();
}
