import { CategoryWithOptions } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { optionsInclude } from "../includes";

export default async function getCategories(): Promise<CategoryWithOptions[]> {
  return await prisma.category.findMany({
    include: optionsInclude,
  });
}
