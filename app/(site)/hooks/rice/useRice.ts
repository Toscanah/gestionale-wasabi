import { useEffect } from "react";
import fetchRequest from "../../lib/api/fetchRequest";
import { RiceLog } from "../../lib/shared/models/rice";
import { isToday } from "date-fns";
import { RiceLogType } from "@prisma/client";
import useRiceState from "./useRiceState";
import { toastSuccess } from "../../lib/utils/global/toast";
import { ShiftFilterValue } from "../../lib/shared";

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

  const getTodayLogs = async (): Promise<RiceLog[]> => {
    const logs = await fetchRequest<RiceLog[]>("GET", "/api/rice", "getRiceLogs");
    return logs.filter((log) => isToday(new Date(log.created_at)));
  };

  const sumLogAmount = (log: RiceLog): number =>
    log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0;

  const fetchDailyRiceUsage = async (shift: ShiftFilterValue): Promise<number> =>
    fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage", { shift });

  const updateRemainingRice = async (total = rice.total) => {
    const [lunch, dinner] = await Promise.all([
      fetchDailyRiceUsage(ShiftFilterValue.LUNCH),
      fetchDailyRiceUsage(ShiftFilterValue.DINNER),
    ]);

    save((prev) => ({
      ...prev,
      remainingLunch: total - lunch,
      remainingDinner: total - dinner,
    }));
  };

  const updateRice = async ({ delta, threshold, log, selectedRiceBatchId }: UpdateRiceInput) => {
    if (!delta) return;

    if (log === "manual") {
      await fetchRequest("POST", "/api/rice", "addRiceLog", {
        riceBatchId: null,
        manualValue: delta,
        type: RiceLogType.MANUAL,
      });
    } else if (log === "batch") {
      await fetchRequest("POST", "/api/rice", "addRiceLog", {
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

    await fetchRequest("POST", "/api/rice", "addRiceLog", {
      riceBatchId: null,
      manualValue: -rice.total,
      type: RiceLogType.RESET,
    });

    await initializeRice();
  };

  const initializeRice = async () => {
    const stored = load();
    const logs = await getTodayLogs();
    const total = logs.reduce((acc, log) => acc + sumLogAmount(log), 0);

    save((prev) => ({
      ...prev,
      total,
      threshold: stored.threshold,
    }));

    await updateRemainingRice(total);
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
