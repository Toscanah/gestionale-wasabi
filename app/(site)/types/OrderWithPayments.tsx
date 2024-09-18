import { Prisma } from "@prisma/client";

export type OrderWithPayments = Prisma.OrderGetPayload<{ include: { payments: true } }> & {
  totalCash: number;
  totalCard: number;
  totalVouch: number;
  totalCredit: number;
};
