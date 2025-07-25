import { Printer } from "../../../(domains)/settings/application/PrinterChoice";

type BusinessTime = `${string}:${string}`;

type BusinessShift = {
  opening: BusinessTime;
  closing: BusinessTime;
};

export type BusinessHours = {
  lunch: BusinessShift;
  dinner: BusinessShift;
};

export type RestaurantSettings = {
  name: string;
  slogan: string;
  address: { street: string; city: string; cap: string; civic: string };
  telNumber: string;
  cellNumber: string;
  pIva: string;
  businessHours: BusinessHours;
};

export type Riders = {
  count: number;
  avgPerHour: number;
};

export type ApplicationSettings = {
  whenSelectorGap: number;
  selectedPrinter: Printer;
  kitchenOffset: number;
  riders: Riders;
  useWhatsApp: boolean;
};

export type GlobalSettings = RestaurantSettings & ApplicationSettings;
