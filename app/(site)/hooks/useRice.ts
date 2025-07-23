import { useEffect, useState } from "react";
import fetchRequest from "../lib/api/fetchRequest";
import { RiceLog } from "../lib/shared/models/Rice";
import { isToday } from "date-fns";
import { RiceLogType } from "@prisma/client";
import { ShiftType } from "../lib/shared/enums/Shift";
import { toastSuccess } from "../lib/utils/toast";

export type Rice = {
  total: number;
  threshold: number;
  remainingLunch: number;
  remainingDinner: number;
};

const DEFAULT_RICE: Rice = {
  total: 0,
  threshold: 0,
  remainingLunch: 0,
  remainingDinner: 0,
};

export type UpdateRiceInput = {
  delta: number;
  threshold: number;
};

export default function useRice() {
  const [rice, setRice] = useState<Rice>(DEFAULT_RICE);

  const saveRiceToLocalStorage = (updater: (prev: Rice) => Rice) => {
    setRice((prev) => {
      const updated = updater(prev);
      localStorage.setItem("rice", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchDailyRiceUsage = async (shift: ShiftType) =>
    fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage", { shift });

  const getTodayLogs = async (): Promise<RiceLog[]> => {
    const logs = await fetchRequest<RiceLog[]>("GET", "/api/rice", "getRiceLogs");
    return logs.filter((log) => isToday(new Date(log.created_at)));
  };

  const sumLogAmount = (log: RiceLog): number =>
    log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0;

  const getTotalRice = async () => {
    const logs = await getTodayLogs();
    return logs.reduce((acc, log) => acc + sumLogAmount(log), 0);
  };

  const updateRice = async ({ delta, threshold }: UpdateRiceInput) => {
    if (delta === 0) return;

    await fetchRequest("POST", "/api/rice", "addRiceLog", {
      riceBatchId: null,
      manualValue: delta,
      type: RiceLogType.MANUAL,
    });

    const newTotal = rice.total + delta;
    saveRiceToLocalStorage((prev) => ({
      ...prev,
      total: newTotal,
      threshold,
    }));

    await updateRemainingRice(newTotal);
    toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
  };

  const updateRemainingRice = async (total = rice.total) => {
    const [usageLunch, usageDinner] = await Promise.all([
      fetchDailyRiceUsage(ShiftType.LUNCH),
      fetchDailyRiceUsage(ShiftType.DINNER),
    ]);

    saveRiceToLocalStorage((prev) => ({
      ...prev,
      remainingLunch: total - usageLunch,
      remainingDinner: total - usageDinner,
    }));
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
    const stored = localStorage.getItem("rice");
    const threshold = stored ? JSON.parse(stored).threshold ?? 0 : 0;

    const logs = await getTodayLogs();
    const total = logs.reduce((acc, log) => acc + sumLogAmount(log), 0);

    saveRiceToLocalStorage((prev) => ({
      ...prev,
      total,
      threshold,
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
