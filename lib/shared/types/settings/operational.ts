export type BusinessTime = `${string}:${string}`;

export type BusinessShift = {
  opening: BusinessTime;
  closing: BusinessTime;
};

export type BusinessHours = {
  lunch: BusinessShift;
  dinner: BusinessShift;
};

export type KitchenSettings = {
  safeCapacity: number;
  maxCapacity: number;
  offset: number;
};

export type TimingsSettings = {
  standardPrepTime: number;
  standardPromiseTime: number;
};

export type RidersSettings = {
  count: number;
  avgPerHour: number;
};

export type OperationalSettings = {
  businessHours: BusinessHours;
  kitchen: KitchenSettings;
  timings: TimingsSettings;
  riders: RidersSettings;
};
