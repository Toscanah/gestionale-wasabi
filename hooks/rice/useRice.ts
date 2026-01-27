import { useEffect } from "react";
import { isToday } from "date-fns";
import { RiceLogType } from "@/prisma/generated/client/enums";
import useRiceState from "./useRiceState";
import { toastSuccess } from "@/lib/shared/utils/global/toast";
import { RiceLog, ShiftFilterValue } from "@/lib/shared";
import { riceAPI } from "@/lib/trpc/api";
import { trpc, trpcClient } from "@/lib/trpc/client";

export type UpdateRiceInput =
  | {
      delta: number;
      threshold: number;
      log: "manual";
      selectedRiceBatchId?: never;
    }
  | {
      delta: number;
      threshold: number;
      log: "batch";
      selectedRiceBatchId: number;
    };

export default function useRice() {
  const { rice, save, load } = useRiceState();
  const addRiceLog = riceAPI.addLog.useMutation();
  const utils = trpc.useUtils();

  const sumLogAmount = (log: RiceLog): number => {
    if (log.type === RiceLogType.BATCH) {
      return log.rice_batch?.amount ?? 0;
    }

    if (log.type === RiceLogType.MANUAL || log.type === RiceLogType.RESET) {
      return log.manual_value ?? 0;
    }
    
    return 0;
  };

  const getTodayLogs = async (): Promise<RiceLog[]> =>
    (await trpcClient.rice.getLogs.query()).filter((log) => isToday(new Date(log.created_at)));

  const fetchDailyRiceUsage = async (shift: ShiftFilterValue): Promise<number> => {
    return (await trpcClient.rice.getDailyUsage.query({ shift })).dailyUsage;
  };

  const updateRemainingRice = async (total = rice.total) => {
    const [lunch, dinner] = await Promise.all([
      fetchDailyRiceUsage(ShiftFilterValue.LUNCH),
      fetchDailyRiceUsage(ShiftFilterValue.DINNER),
    ]);

    utils.rice.getLogs.invalidate();

    save((prev) => ({
      ...prev,
      remainingLunch: total - lunch,
      remainingDinner: total - dinner,
    }));
  };

  const updateRice = async ({ delta, threshold, log, selectedRiceBatchId }: UpdateRiceInput) => {
    if (!delta) return;

    if (log === "manual") {
      addRiceLog.mutate({
        riceBatchId: null,
        manualValue: delta,
        type: RiceLogType.MANUAL,
      });
    } else {
      addRiceLog.mutate({
        riceBatchId: selectedRiceBatchId,
        manualValue: null,
        type: RiceLogType.BATCH,
      });
    }


    const newTotal = rice.total + delta;

    save((prev) => ({
      ...prev,
      total: newTotal,
      threshold,
    }));

    await updateRemainingRice(newTotal);
    toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
  };

  const resetRice = async () => {
    if (!rice.total) return;

    addRiceLog.mutate({
      riceBatchId: null,
      manualValue: -rice.total,
      type: RiceLogType.RESET,
    });

    await initializeRice();
  };

  const initializeRice = async () => {
    try {
      const stored = load();
      const logs = await getTodayLogs();
      const total = logs.reduce((acc, log) => acc + sumLogAmount(log), 0);

      save((prev) => ({
        ...prev,
        total,
        threshold: stored.threshold,
      }));

      await updateRemainingRice(total);
    } catch (error) {
      console.error("Failed to initialize rice:", error);
    }
  };

  useEffect(() => {
    initializeRice();
  }, []);

  return {
    rice,
    resetRice,
    updateRice,
    updateRemainingRice,
  };
}
