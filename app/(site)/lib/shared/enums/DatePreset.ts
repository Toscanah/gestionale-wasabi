export enum DatePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST_7 = "last7",
  LAST_30 = "last30",
  LAST_MONTH = "lastMonth",
  THIS_MONTH = "thisMonth",
  THIS_YEAR = "thisYear",
}

const presetsName = [
  "Oggi",
  "Ieri",
  "Ultimi 7 giorni",
  "Ultimi 30 giorni",
  "Mese scorso",
  "Questo mese",
  "Quest'anno",
] as const;

export const DATE_PRESETS: { name: (typeof presetsName)[number]; value: DatePreset }[] =
  presetsName.map((name, index) => ({
    name,
    value: Object.values(DatePreset)[index] as DatePreset,
  }));
