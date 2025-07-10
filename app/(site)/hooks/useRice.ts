import { useEffect, useState } from "react";
import { toastSuccess } from "../lib/utils/toast";
import fetchRequest from "../lib/core/fetchRequest";
import { RiceLog } from "../lib/shared/models/Rice";
import { isToday } from "date-fns";
import { RiceLogType } from "@prisma/client";

export type Rice = { total: number; remaining: number; threshold: number };

export default function useRice() {
  const defaultRice: Rice = {
    total: 0,
    remaining: 0,
    threshold: 0,
  };

  const [rice, setRice] = useState<Rice>(defaultRice);

  const saveRiceToLocalStorage = (updater: (prevRice: Rice) => Rice) =>
    setRice((prevRice) => {
      const newRice = updater(prevRice);
      localStorage.setItem("rice", JSON.stringify(newRice));
      return newRice;
    });

  const updateRice = (newRice: Rice) => {
    saveRiceToLocalStorage((prevRice) => ({
      ...prevRice,
      ...newRice,
      total: prevRice.total + newRice.total,
    }));

    updateRemainingRice();
    toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
  };

  const updateRemainingRice = async () => {
    const dailyUsage = await fetchDailyRiceUsage();
    const { totalRice } = await getTotalRice();
    saveRiceToLocalStorage((prevRice) => ({
      ...prevRice,
      remaining: totalRice - dailyUsage,
    }));
  };

  const fetchDailyRiceUsage = async (): Promise<number> =>
    await fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage");

  const getTotalRice = async (): Promise<{ totalRice: number }> => {
    const logs = await fetchRequest<RiceLog[]>("GET", "/api/rice", "getRiceLogs");
    const todayLogs = logs.filter((log) => isToday(new Date(log.created_at)));
    return {
      totalRice: todayLogs.reduce(
        (acc, log) => acc + (log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0),
        0
      ),
    };
  };

  const resetRice = async () => {
    if (!rice.total) return;

    await fetchRequest("POST", "/api/rice", "addRiceLog", {
      riceBatchId: null,
      manualValue: -rice.total,
      type: RiceLogType.RESET,
    }).then(initializeRice);
  };

  const initializeRice = async () => {
    const storedRice = localStorage.getItem("rice");

    const dailyUsage = await fetchDailyRiceUsage();
    const { totalRice } = await getTotalRice();

    let rice: Rice;

    if (storedRice) {
      const parsedRice: Rice = JSON.parse(storedRice);

      rice = {
        ...parsedRice,
        total: totalRice,
        remaining: totalRice - dailyUsage,
      };
    } else {
      rice = {
        ...defaultRice,
        total: totalRice,
        remaining: totalRice - dailyUsage,
      };
    }

    saveRiceToLocalStorage(() => rice);
  };

  useEffect(() => {
    initializeRice();
  }, []);

  return { rice, resetRice, updateRice, updateRemainingRice };
}
