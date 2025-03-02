import { CustomerWithDetails } from "../models";

export type CustomerWithStats = CustomerWithDetails & {
  averageOrdersWeek: number;
  averageOrdersMonth: number;
  averageOrdersYear: number;
  averageSpending: number;
  lastOrder: Date | undefined;
  firstOrder: Date | undefined;
  totalSpending: number;
};
