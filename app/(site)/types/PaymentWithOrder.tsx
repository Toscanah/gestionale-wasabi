import { Prisma } from "@prisma/client";

export type PaymentWithOrder = Prisma.PaymentGetPayload<{
  include: {
    order: {
      include: {
        home_order: true,
        pickup_order: true,
        table_order: true,
      }
    }
  }
}>