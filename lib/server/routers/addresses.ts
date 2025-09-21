import { AddressContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import createAddress from "@/app/(site)/lib/db/addresses/createAddress";
import updateAddress from "@/app/(site)/lib/db/addresses/updateAddress";
import getAddressesByCustomer from "@/app/(site)/lib/db/addresses/getAddressesByCustomer";
import getLastAddressIdOfCustomer from "@/app/(site)/lib/db/addresses/getLastAddressIdOfCustomer";

export const addressesRouter = createTRPCRouter({
  create: publicProcedure
    .input(AddressContracts.Create.Input)
    .output(AddressContracts.Create.Output)
    .mutation(({ input }) => createAddress(input)),

  update: publicProcedure
    .input(AddressContracts.Update.Input)
    .output(AddressContracts.Update.Output)
    .mutation(async ({ input }) => updateAddress(input)),

  getByCustomer: publicProcedure
    .input(AddressContracts.GetByCustomer.Input)
    .output(AddressContracts.GetByCustomer.Output)
    .query(({ input }) => getAddressesByCustomer(input)),

  getLastOfCustomer: publicProcedure
    .input(AddressContracts.GetLastIdOfCustomer.Input)
    .output(AddressContracts.GetLastIdOfCustomer.Output)
    .query(({ input }) => getLastAddressIdOfCustomer(input)),
});
