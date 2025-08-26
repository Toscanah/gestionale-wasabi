// prisma-json.d.ts
import type { RFMCustomerSegment as RFMType } from "./RFM";

declare global {
  namespace PrismaJson {
    type RFMCustomerSegment = RFMType;
  }
}

export {};
