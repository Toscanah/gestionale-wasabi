import { CustomerContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getCustomerByPhone from "@/app/(site)/lib/db/customers/getCustomerByPhone";
import getCustomerWithDetails from "@/app/(site)/lib/db/customers/getCustomerWithDetails";
import getCustomersWithDetails from "@/app/(site)/lib/db/customers/getCustomersWithDetails";
import getCustomersByDoorbell from "@/app/(site)/lib/db/customers/getCustomersByDoorbell";
import updateCustomerFromAdmin from "@/app/(site)/lib/db/customers/updateCustomerFromAdmin";
import updateCustomerFromOrder from "@/app/(site)/lib/db/customers/updateCustomerFromOrder";
import createCustomer from "@/app/(site)/lib/db/customers/createCustomer";
import updateCustomerAddresses from "@/app/(site)/lib/db/customers/updateCustomerAddresses";
import updateCustomerOrderNotes from "@/app/(site)/lib/db/customers/updateCustomerOrderNotes";
import toggleCustomer from "@/app/(site)/lib/db/customers/toggleCustomer";
import deleteCustomerById from "@/app/(site)/lib/db/customers/deleteCustomerById";
import computeCustomersStats from "@/app/(site)/lib/db/customers/computeCustomersStats";

export const customersRouter = createTRPCRouter({
  getByPhone: publicProcedure
    .input(CustomerContracts.GetByPhone.Input)
    .output(CustomerContracts.GetByPhone.Output)
    .query(({ input }) => getCustomerByPhone(input)),

  getWithDetails: publicProcedure
    .input(CustomerContracts.GetWithDetails.Input)
    .output(CustomerContracts.GetWithDetails.Output)
    .query(({ input }) => getCustomerWithDetails(input)),

  getAllWithDetails: publicProcedure
    .input(CustomerContracts.GetAllWithDetails.Input)
    .output(CustomerContracts.GetAllWithDetails.Output)
    .query(({ input }) => getCustomersWithDetails(input)),

  getByDoorbell: publicProcedure
    .input(CustomerContracts.GetByDoorbell.Input)
    .output(CustomerContracts.GetByDoorbell.Output)
    .query(({ input }) => getCustomersByDoorbell(input)),

  updateFromAdmin: publicProcedure
    .input(CustomerContracts.UpdateFromAdmin.Input)
    .output(CustomerContracts.UpdateFromAdmin.Output)
    .mutation(({ input }) => updateCustomerFromAdmin(input)),

  updateFromOrder: publicProcedure
    .input(CustomerContracts.UpdateFromOrder.Input)
    .output(CustomerContracts.UpdateFromOrder.Output)
    .mutation(({ input }) => updateCustomerFromOrder(input)),

  create: publicProcedure
    .input(CustomerContracts.Create.Input)
    .output(CustomerContracts.Create.Output)
    .mutation(({ input }) => createCustomer(input)),

  updateAddresses: publicProcedure
    .input(CustomerContracts.UpdateAddresses.Input)
    .output(CustomerContracts.UpdateAddresses.Output)
    .mutation(({ input }) => updateCustomerAddresses(input)),

  updateOrderNotes: publicProcedure
    .input(CustomerContracts.UpdateOrderNotes.Input)
    .output(CustomerContracts.UpdateOrderNotes.Output)
    .mutation(({ input }) => updateCustomerOrderNotes(input)),

  toggle: publicProcedure
    .input(CustomerContracts.Toggle.Input)
    .output(CustomerContracts.Toggle.Output)
    .mutation(({ input }) => toggleCustomer(input)),

  deleteById: publicProcedure
    .input(CustomerContracts.DeleteById.Input)
    .output(CustomerContracts.DeleteById.Output)
    .mutation(({ input }) => deleteCustomerById(input)),

  computeStats: publicProcedure
    .input(CustomerContracts.ComputeStats.Input)
    .output(CustomerContracts.ComputeStats.Output)
    .query(({ input }) => computeCustomersStats(input)),
});
