import {
  Customer,
  Order as PrismaOrder,
  Product,
  Table,
  Prisma,
} from "@prisma/client";

export type Order = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    table: true;
    products: true;
    address: true;
  };
}>;

// export type Order = PrismaOrder & {
//   products: Product[];
//   customer: Customer;
//   table: Table;
// };
