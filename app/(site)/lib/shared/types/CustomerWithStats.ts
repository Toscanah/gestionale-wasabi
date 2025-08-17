import { CustomerWithDetails } from "../models/_index";
import { RFMRules, RFMDimension, RFMCustomerSegment } from "./RFM";

export type CustomerWithStats = CustomerWithDetails & {
  averageOrdersWeek: number;
  averageOrdersMonth: number;
  averageOrdersYear: number;
  averageSpending: number;
  lastOrder: Date | undefined;
  firstOrder: Date | undefined;
  totalSpending: number;
  rfm: RFMCustomerSegment
};
