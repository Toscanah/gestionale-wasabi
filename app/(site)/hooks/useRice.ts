import { useEffect, useState } from "react";
import { toastSuccess } from "../lib/utils/toast";
import fetchRequest from "../lib/api/fetchRequest";
import { RiceLog } from "../lib/shared/models/Rice";
import { isToday, isWithinInterval, parseISO, set } from "date-fns";
import { RiceLogType } from "@prisma/client";
import Timestamps from "../lib/shared/enums/Timestamps";

export type Rice = { total: number; remaining: number; threshold: number };

function getTodayTime(decimalHour: number): Date {
  const today = new Date();
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
}

const LUNCH_START = getTodayTime(Timestamps.LUNCH_START);
const LUNCH_END = getTodayTime(Timestamps.LUNCH_END);
const DINNER_START = getTodayTime(Timestamps.DINNER_START);
const DINNER_END = getTodayTime(Timestamps.DINNER_END);

export default function useRice() {
  const defaultRice: Rice = { total: 0, remaining: 0, threshold: 0 };
  const [rice, setRice] = useState<Rice>(defaultRice);
  const [lunchRice, setLunchRice] = useState<number>(0);
  const [dinnerRice, setDinnerRice] = useState<number>(0);

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

  const getTotalRice = async (): Promise<{ totalRice: number; todayLogs: RiceLog[] }> => {
    const logs = await fetchRequest<RiceLog[]>("GET", "/api/rice", "getRiceLogs");
    const todayLogs = logs.filter((log) => isToday(new Date(log.created_at)));
    const totalRice = todayLogs.reduce(
      (acc, log) => acc + (log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0),
      0
    );
    return { totalRice, todayLogs };
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
    const { totalRice, todayLogs } = await getTotalRice();

    // Calculate lunch and dinner rice from today's logs
    let lunch = 0;
    let dinner = 0;

    for (const log of todayLogs) {
      const time = new Date(log.created_at);
      const amount = log.rice_batch_id ? log.rice_batch.amount : log.manual_value ?? 0;

      if (isWithinInterval(time, { start: LUNCH_START, end: LUNCH_END })) {
        lunch += amount;
      } else if (isWithinInterval(time, { start: DINNER_START, end: DINNER_END })) {
        dinner += amount;
      }
    }

    setLunchRice(lunch);
    setDinnerRice(dinner);

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

  return { rice, resetRice, updateRice, updateRemainingRice, lunchRice, dinnerRice };
}
