import { Printer } from "../settings/application/PrinterChoice";

export type BusinessTime  = `${string}:${string}`;

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
  orderProcessingHours: {
    lunch: { open: BusinessTime ; close: BusinessTime  };
    dinner: { open: BusinessTime ; close: BusinessTime  };
  };
};

export type GlobalSettings = RestaurantSettings & ApplicationSettings;
