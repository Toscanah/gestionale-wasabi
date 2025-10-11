import { CategoryContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { optionsInclude } from "../includes";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default async function createNewCategory({
  category,
}: CategoryContracts.Create.Input): Promise<CategoryContracts.Create.Output> {
  const { category: categoryName, options } = category;
  return await prisma.$transaction(async (tx) => {
    const existingCategory = await tx.category.findFirst({
      where: { category: categoryName },
    });

    if (existingCategory) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Category with this name already exists.",
      });
    }

    const data: Prisma.CategoryCreateInput = { category: categoryName };

    if (options?.length) {
      data.options = {
        createMany: {
          data: options.map((option) => ({
            option_id: option.option.id,
          })),
        },
      };
    }

    return await tx.category.create({
      data,
      include: optionsInclude,
    });
  });
}
