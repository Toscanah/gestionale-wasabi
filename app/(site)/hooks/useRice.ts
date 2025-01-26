import { useEffect, useState } from "react";
import { toastSuccess } from "../functions/util/toast";
import fetchRequest from "../functions/api/fetchRequest";

export type Rice = { amount: number; threshold: number };
export type RiceState = { total: Rice; remaining: Rice };

export default function useRice() {
  const defaultRice: RiceState = {
    total: { amount: 0, threshold: 0 },
    remaining: { amount: 0, threshold: 0 },
  };

  const [rice, setRice] = useState<RiceState>(defaultRice);

  const saveRiceToLocalStorage = (updater: (prevRice: RiceState) => RiceState) =>
    setRice((prevRice) => {
      const newRice = updater(prevRice);
      localStorage.setItem("rice", JSON.stringify(newRice));
      return newRice;
    });

  const updateTotalRice = (total: Rice) => {
    saveRiceToLocalStorage((prevRice) => ({
      ...prevRice,
      total: { ...total, amount: total.amount + prevRice.total.amount },
    }));

    updateRemainingRice();
    toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
  };

  const updateRemainingRice = () =>
    fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage").then((dailyUsage) => {
      saveRiceToLocalStorage((prevRice) => ({
        ...prevRice,
        remaining: { ...prevRice.remaining, amount: prevRice.total.amount - dailyUsage },
      }));
    });

  const fetchDailyRiceUsage = async (): Promise<number> =>
    await fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage");

  const resetRice = async () => {
    const dailyUsage = await fetchDailyRiceUsage();

    saveRiceToLocalStorage((prevRice) => ({
      ...prevRice,
      total: {
        ...prevRice.total,
        amount: 0,
      },
      remaining: {
        ...prevRice.remaining,
        amount: -dailyUsage,
      },
    }));
  };

  const initializeRiceState = async () => {
    const storedRice = localStorage.getItem("rice");
    const dailyUsage = await fetchDailyRiceUsage();
    let rice;

    if (storedRice) {
      const parsedRice: RiceState = JSON.parse(storedRice);

      rice = {
        ...parsedRice,
        remaining: {
          ...parsedRice.remaining,
          amount: parsedRice.total.amount - dailyUsage,
        },
      };
    } else {
      rice = { ...defaultRice, remaining: { ...defaultRice.remaining, amount: -dailyUsage } };
    }

    saveRiceToLocalStorage(() => rice);
  };

  useEffect(() => {
    initializeRiceState();
  }, []);

  return { rice, resetRice, updateTotalRice, updateRemainingRice };
}
