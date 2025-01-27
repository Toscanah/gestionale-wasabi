import { useEffect, useState } from "react";
import { toastSuccess } from "../functions/util/toast";
import fetchRequest from "../functions/api/fetchRequest";

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
    }));

    updateRemainingRice();
    toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
  };

  const updateRemainingRice = () =>
    fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage").then((dailyUsage) =>
      saveRiceToLocalStorage((prevRice) => ({
        ...prevRice,
        remaining: prevRice.total - dailyUsage,
      }))
    );

  const fetchDailyRiceUsage = async (): Promise<number> =>
    await fetchRequest<number>("GET", "/api/rice", "getDailyRiceUsage");

  const resetRice = async () => {
    const dailyUsage = await fetchDailyRiceUsage();

    saveRiceToLocalStorage(() => ({
      threshold: 0,
      total: 0,
      remaining: -dailyUsage,
    }));
  };

  const initializeRice = async () => {
    const storedRice = localStorage.getItem("rice");
    const dailyUsage = await fetchDailyRiceUsage();
    let rice;

    if (storedRice) {
      const parsedRice: Rice = JSON.parse(storedRice);

      rice = {
        ...parsedRice,
        remaining: parsedRice.total - dailyUsage,
      };
    } else {
      rice = { ...defaultRice, remaining: -dailyUsage };
    }

    saveRiceToLocalStorage(() => rice);
  };

  useEffect(() => {
    initializeRice();
  }, []);

  return { rice, resetRice, updateRice, updateRemainingRice };
}
