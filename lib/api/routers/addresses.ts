import { createTRPCRouter, publicProcedure } from "../trpc";
import createAddress from "@/lib/database/addresses/createAddress";
import updateAddress from "@/lib/database/addresses/updateAddress";
import getAddressesByCustomer from "@/lib/database/addresses/getAddressesByCustomer";
import getLastAddressIdOfCustomer from "@/lib/database/addresses/getLastAddressIdOfCustomer";
import { AddressContracts } from "@/lib/shared";

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
