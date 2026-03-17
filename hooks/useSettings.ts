import { useEffect, useState } from "react";
import { GlobalSettings } from "@/lib/shared/types/settings/global";
import { DEFAULT_SETTINGS } from "@/lib/shared/constants/config/settings";
import { DottedKeys } from "@/lib/shared";

export default function useSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);

  const saveSettingsToLocalStorage = (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const getSettings = () => {
    const storedSettings = localStorage.getItem("settings");
    saveSettingsToLocalStorage(
      storedSettings
        ? {
            ...DEFAULT_SETTINGS,
            ...(JSON.parse(storedSettings) as GlobalSettings),
          }
        : DEFAULT_SETTINGS,
    );
  };

  // Allows updating nested attributes dynamically via path segments: "profile.name"
  const updateSettings = (key: DottedKeys<GlobalSettings>, value: any) => {
    let newValue = value;

    if (key === "application.whenSelectorGap" && (value === null || isNaN(Number(value)))) {
      newValue = 1;
    }

    setSettings((prev) => {
      const parts = key.split(".");
      const newSettings = { ...prev };
      let current: any = newSettings;

      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }

      current[parts[parts.length - 1]] = newValue;

      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  useEffect(getSettings, []);

  return { settings, updateSettings, getSettings };
}
