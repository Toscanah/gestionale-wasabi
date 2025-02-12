import { useEffect, useState } from "react";
import { GlobalSettings } from "../types/Settings";
import { predefinedPrinters } from "../components/settings/application/PrinterChoice";

export const defaultSettings: GlobalSettings = {
  address: { cap: "34135", city: "Trieste", civic: "2/b", street: "Scala al Belvedere" },
  name: "Wasabi Sushi",
  slogan: "",
  cellNumber: "338 1278651",
  telNumber: "040 4702081",
  pIva: "01152790323",
  kitchenOffset: 20,
  whenSelectorGap: 5,
  selectedPrinter: predefinedPrinters[0],
};

export default function useSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);

  const saveSettingsToLocalStorage = (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const getSettings = () => {
    const storedSettings = localStorage.getItem("settings");
    saveSettingsToLocalStorage(
      storedSettings
        ? { ...defaultSettings, ...(JSON.parse(storedSettings) as GlobalSettings) }
        : defaultSettings
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
