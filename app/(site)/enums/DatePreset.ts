export enum DatePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST7 = "last7",
  LAST30 = "last30",
  THIS_MONTH = "thisMonth",
  THIS_YEAR = "thisYear",
}

export const DATE_PRESETS = [
  { name: "Oggi", value: DatePreset.TODAY },
  { name: "Ieri", value: DatePreset.YESTERDAY },
  { name: "Ultimi 7 giorni", value: DatePreset.LAST7 },
  { name: "Ultimi 30 giorni", value: DatePreset.LAST30 },
  { name: "Questo mese", value: DatePreset.THIS_MONTH },
  { name: "Questo anno", value: DatePreset.THIS_YEAR },
];
