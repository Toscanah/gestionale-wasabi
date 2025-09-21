import { OptionContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getAllOptions from "@/app/(site)/lib/db/options/getAllOptions";
import getAllOptionsWithCategories from "@/app/(site)/lib/db/options/getAllOptionsWithCategories";
import updateOptionsOfCategory from "@/app/(site)/lib/db/options/updateOptionsOfCategory";
import updateOption from "@/app/(site)/lib/db/options/updateOption";
import createNewOption from "@/app/(site)/lib/db/options/createNewOption";
import toggleOption from "@/app/(site)/lib/db/options/toggleOption";

export const optionsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(OptionContracts.GetAll.Input)
    .output(OptionContracts.GetAll.Output)
    .query(({ input }) => getAllOptions(input)),

  getAllWithCategories: publicProcedure
    .input(OptionContracts.GetAllWithCategories.Input)
    .output(OptionContracts.GetAllWithCategories.Output)
    .query(({ input }) => getAllOptionsWithCategories(input)),

  updateOptionsOfCategory: publicProcedure
    .input(OptionContracts.UpdateOptionsOfCategory.Input)
    .output(OptionContracts.UpdateOptionsOfCategory.Output)
    .mutation(({ input }) => updateOptionsOfCategory(input)),

  update: publicProcedure
    .input(OptionContracts.Update.Input)
    .output(OptionContracts.Update.Output)
    .mutation(({ input }) => updateOption(input)),

  create: publicProcedure
    .input(OptionContracts.Create.Input)
    .output(OptionContracts.Create.Output)
    .mutation(({ input }) => createNewOption(input)),

  toggle: publicProcedure
    .input(OptionContracts.Toggle.Input)
    .output(OptionContracts.Toggle.Output)
    .mutation(({ input }) => toggleOption(input)),
});
