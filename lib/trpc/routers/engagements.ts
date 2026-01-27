import { EngagementContracts } from "@/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getEngagementTemplates from "@/lib/db/engagement/templates/getEngagementTemplates";
import createEngagementTemplate from "@/lib/db/engagement/templates/createEngagementTemplate";
import updateEngagementTemplate from "@/lib/db/engagement/templates/updateEngagementTemplate";
import createEngagement from "@/lib/db/engagement/createEngagement";
import getEngagementsByCustomer from "@/lib/db/engagement/getEngagementsByCustomer";
import deleteEngagementById from "@/lib/db/engagement/deleteEngagementById";
import toggleEngagementById from "@/lib/db/engagement/toggleEngagementById";
import getEngagementsLedgersByCustomer from "@/lib/db/engagement/ledgers/getEngagementsLedgersByCustomer";
import issueLedgers from "@/lib/db/engagement/ledgers/issueLedgers";
import updateLedgerStatus from "@/lib/db/engagement/ledgers/updateLedgerStatus";
import deleteTemplateById from "@/lib/db/engagement/templates/deleteTemplateById";

export const engagementsRouter = createTRPCRouter({
  getTemplates: publicProcedure
    .input(EngagementContracts.GetTemplates.Input)
    .output(EngagementContracts.GetTemplates.Output)
    .query(({ input }) => getEngagementTemplates(input)),

  createTemplate: publicProcedure
    .input(EngagementContracts.CreateTemplate.Input)
    .output(EngagementContracts.CreateTemplate.Output)
    .mutation(({ input }) => createEngagementTemplate(input)),

  updateTemplate: publicProcedure
    .input(EngagementContracts.UpdateTemplate.Input)
    .output(EngagementContracts.UpdateTemplate.Output)
    .mutation(({ input }) => updateEngagementTemplate(input)),

  create: publicProcedure
    .input(EngagementContracts.Create.Input)
    .output(EngagementContracts.Create.Output)
    .mutation(({ input }) => createEngagement(input)),

  getByCustomer: publicProcedure
    .input(EngagementContracts.GetByCustomer.Input)
    .output(EngagementContracts.GetByCustomer.Output)
    .query(({ input }) => getEngagementsByCustomer(input)),

  deleteEngagementById: publicProcedure
    .input(EngagementContracts.DeleteEngagementById.Input)
    .output(EngagementContracts.DeleteEngagementById.Output)
    .mutation(({ input }) => deleteEngagementById(input)),

  deleteTemplateById: publicProcedure
    .input(EngagementContracts.DeleteTemplateById.Input)
    .output(EngagementContracts.DeleteTemplateById.Output)
    .mutation(({ input }) => deleteTemplateById(input)),

  toggleById: publicProcedure
    .input(EngagementContracts.ToggleById.Input)
    .output(EngagementContracts.ToggleById.Output)
    .mutation(({ input }) => toggleEngagementById(input)),

  getLedgersByCustomer: publicProcedure
    .input(EngagementContracts.GetLedgersByCustomer.Input)
    .output(EngagementContracts.GetLedgersByCustomer.Output)
    .query(({ input }) => getEngagementsLedgersByCustomer(input)),

  issueLedgers: publicProcedure
    .input(EngagementContracts.IssueLedgers.Input)
    .output(EngagementContracts.IssueLedgers.Output)
    .mutation(({ input }) => issueLedgers(input)),

  updateLedgerStatus: publicProcedure
    .input(EngagementContracts.UpdateLedgerStatus.Input)
    .output(EngagementContracts.UpdateLedgerStatus.Output)
    .mutation(({ input }) => updateLedgerStatus(input)),
});
