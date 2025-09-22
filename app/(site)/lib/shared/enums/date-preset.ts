export enum DatePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST_7 = "last7",
  LAST_30 = "last30",
  LAST_MONTH = "lastMonth",
  THIS_MONTH = "thisMonth",
  THIS_YEAR = "thisYear",
  TO_TODAY = "toToday",
}

const presetsName = {
  [DatePreset.TODAY]: "Oggi",
  [DatePreset.YESTERDAY]: "Ieri",
  [DatePreset.LAST_7]: "Ultimi 7 giorni",
  [DatePreset.LAST_30]: "Ultimi 30 giorni",
  [DatePreset.LAST_MONTH]: "Mese scorso",
  [DatePreset.THIS_MONTH]: "Questo mese",
  [DatePreset.THIS_YEAR]: "Quest'anno",
  [DatePreset.TO_TODAY]: "Fino ad oggi",
} as const;

export const DATE_FILTERING_PRESETS: { name: string; value: DatePreset }[] = Object.entries(
  presetsName
).map(([value, name]) => ({
  name,
  value: value as DatePreset,
}));
