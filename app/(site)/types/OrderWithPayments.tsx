import { Prisma } from "@prisma/client";
import { ProductInOrderType } from "./ProductInOrderType";

export type OrderWithPayments = Prisma.OrderGetPayload<{
  include: {
    payments: true;

  };
}> & {
  products: ProductInOrderType[];
  totalCash: number;
  totalCard: number;
  totalVouch: number;
  totalCredit: number;
};
