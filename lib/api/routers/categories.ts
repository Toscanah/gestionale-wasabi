import { createTRPCRouter, publicProcedure } from "../trpc";
import createNewCategory from "@/lib/database/categories/createNewCategory";
import updateCategory from "@/lib/database/categories/updateCategory";
import toggleCategory from "@/lib/database/categories/toggleCategory";
import getCategories from "@/lib/database/categories/getCategories";
import countProductsByCategory from "@/lib/database/categories/countProductsByCategory";
import { CategoryContracts } from "@/lib/shared";

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
