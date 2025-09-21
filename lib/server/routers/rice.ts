import { RiceContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import addRiceBatch from "@/app/(site)/lib/db/rice/addRiceBatch";
import updateRiceBatch from "@/app/(site)/lib/db/rice/updateRiceBatch";
import addRiceLog from "@/app/(site)/lib/db/rice/addRiceLog";
import getDailyRiceUsage from "@/app/(site)/lib/db/rice/getDailyRiceUsage";
import getRiceBatches from "@/app/(site)/lib/db/rice/getRiceBatches";
import deleteRiceBatch from "@/app/(site)/lib/db/rice/deleteRiceBatch";
import getRiceLogs from "@/app/(site)/lib/db/rice/getRiceLogs";

export const riceRouter = createTRPCRouter({
  addBatch: publicProcedure
    .input(RiceContracts.AddBatch.Input)
    .output(RiceContracts.AddBatch.Output)
    .mutation(({ input }) => addRiceBatch(input)),

  updateBatch: publicProcedure
    .input(RiceContracts.UpdateBatch.Input)
    .output(RiceContracts.UpdateBatch.Output)
    .mutation(({ input }) => updateRiceBatch(input)),

  addLog: publicProcedure
    .input(RiceContracts.AddLog.Input)
    .output(RiceContracts.AddLog.Output)
    .mutation(({ input }) => addRiceLog(input)),

  getDailyUsage: publicProcedure
    .input(RiceContracts.GetDailyUsage.Input)
    .output(RiceContracts.GetDailyUsage.Output)
    .query(({ input }) => getDailyRiceUsage(input)),

  getBatches: publicProcedure
    .input(RiceContracts.GetBatches.Input)
    .output(RiceContracts.GetBatches.Output)
    .query(({ input }) => getRiceBatches(input)),

  deleteBatch: publicProcedure
    .input(RiceContracts.DeleteBatch.Input)
    .output(RiceContracts.DeleteBatch.Output)
    .mutation(({ input }) => deleteRiceBatch(input)),

  getLogs: publicProcedure
    .input(RiceContracts.GetLogs.Input)
    .output(RiceContracts.GetLogs.Output)
    .query(({ input }) => getRiceLogs(input)),
});
