import { CategoryContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import createNewCategory from "@/app/(site)/lib/db/categories/createNewCategory";
import updateCategory from "@/app/(site)/lib/db/categories/updateCategory";
import toggleCategory from "@/app/(site)/lib/db/categories/toggleCategory";
import getCategories from "@/app/(site)/lib/db/categories/getCategories";
import countProductsByCategory from "@/app/(site)/lib/db/categories/countProductsByCategory";

export const categoriesRouter = createTRPCRouter({
  create: publicProcedure
    .input(CategoryContracts.Create.Input)
    .output(CategoryContracts.Create.Output)
    .mutation(({ input }) => createNewCategory(input)),

  countProductsByCategory: publicProcedure
    .input(CategoryContracts.CountProductsByCategory.Input)
    .output(CategoryContracts.CountProductsByCategory.Output)
    .query(({ input }) => {
      return countProductsByCategory(input);
    }),

  update: publicProcedure
    .input(CategoryContracts.Update.Input)
    .output(CategoryContracts.Update.Output)
    .mutation(({ input }) => updateCategory(input)),

  toggle: publicProcedure
    .input(CategoryContracts.Toggle.Input)
    .output(CategoryContracts.Toggle.Output)
    .mutation(({ input }) => toggleCategory(input)),

  getAll: publicProcedure
    .input(CategoryContracts.GetAll.Input)
    .output(CategoryContracts.GetAll.Output)
    .query(() => getCategories()),

  // getAllWithOptions: publicProcedure
  //   .input(CategoryContracts.GetAllWithOptions.Input)
  //   .output(CategoryContracts.GetAllWithOptions.Output)
  //   .query(() => getCategories({ includeOptions: true })),
});
