import { Prisma } from "@prisma/client";

export type CustomerWithDetails = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
  };
}> & { phone: number };
