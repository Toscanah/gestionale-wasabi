import { Printer } from "../components/settings/application/PrinterChoice";

export type RestaurantSettings = {
  name: string;
  slogan: string;
  address: { street: string; city: string; cap: string; civic: string };
  telNumber: string;
  cellNumber: string;
  pIva: string;
};

export type ApplicationSettings = {
  whenSelectorGap: number;
  selectedPrinter: Printer;
  kitchenOffset: number;
};

export type GlobalSettings = RestaurantSettings & ApplicationSettings;
