import type { RFMCustomerSegment as RFMType } from "../rfm";
import { CustomerDiscount as CustomerDiscountType } from "./customer-discount";

declare global {
  namespace PrismaJson {
    type RFMCustomerSegment = RFMType;
    type CustomerDiscount = CustomerDiscountType;
  }
}

export {};
