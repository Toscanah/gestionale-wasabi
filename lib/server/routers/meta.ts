import { MetaContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getTemplates as getMetaTemplates } from "@/app/(site)/lib/integrations/meta/getTemplates";
import sendMetaMessage from "@/app/(site)/lib/integrations/meta/sendMetaMessage";

export const metaRouter = createTRPCRouter({
  getTemplates: publicProcedure
    .input(MetaContracts.GetTemplates.Input)
    .output(MetaContracts.GetTemplates.Output)
    .query(({ input }) => getMetaTemplates(input)),

  sendMessage: publicProcedure
    .input(MetaContracts.SendMessage.Input)
    .output(MetaContracts.SendMessage.Output)
    .mutation(({ input }) => sendMetaMessage(input)),
});
