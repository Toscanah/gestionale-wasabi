import type { RFMCustomerSegment as RFMType } from "./rfm";

declare global {
  namespace PrismaJson {
    type RFMCustomerSegment = RFMType;
  }
}

export {};
