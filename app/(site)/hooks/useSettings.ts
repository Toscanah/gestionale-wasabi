import { useEffect, useState } from "react";
import { predefinedPrinters } from "../components/settings/PrinterChoice";
import { GlobalSettings } from "../types/GlobalSettings";

export const defaultSettings: GlobalSettings = {
  pIva: "01152790323",
  kitchenOffset: 0,
  whenSelectorGap: 1,
  selectedPrinter: predefinedPrinters[1],
};

export default function useSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);

  const saveSettingsToLocalStorage = (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
  };

  const getSettings = () => {
    const storedSettings = localStorage.getItem("settings");
    saveSettingsToLocalStorage(
      storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings
    );
  };

  const updateSettings = (key: keyof GlobalSettings, value: any) => {
    let newValue = value;

    if (key === "kitchenOffset" && (value === null || isNaN(Number(value)))) {
      newValue = 0;
    }

    if (key === "whenSelectorGap" && (value === null || isNaN(Number(value)))) {
      newValue = 1;
    }

    saveSettingsToLocalStorage({ ...settings, [key]: newValue });
  };

  useEffect(() => getSettings(), []);

  return { settings, updateSettings };
}
