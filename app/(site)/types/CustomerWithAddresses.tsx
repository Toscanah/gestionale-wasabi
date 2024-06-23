import { Prisma } from "@prisma/client";

export type CustomerWithAddresses = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
  };
}>;
