import { OptionWithCategories } from "../../models";
import prisma from "../db";

export default async function getAllOptionsWithCategories(): Promise<OptionWithCategories[]> {
  return await prisma.option.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

}
