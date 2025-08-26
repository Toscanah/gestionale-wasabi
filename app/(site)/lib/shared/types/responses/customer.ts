import { CustomerWithStats } from "../CustomerWithStats";

export type GetCustomersWithStatsResponse = {
  customers: CustomerWithStats[];
  totalCount: number;
};
