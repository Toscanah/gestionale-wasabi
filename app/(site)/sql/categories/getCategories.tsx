import prisma from "../db";

export default async function getCategories() {
  return await prisma.category.findMany();
}
