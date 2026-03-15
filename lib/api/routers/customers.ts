import { CustomerContracts } from "@/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getCustomerByPhone from "@/lib/database/customers/getCustomerByPhone";
import getComprehensiveCustomer from "@/lib/database/customers/getComprehensiveCustomer";
import getComprehensiveCustomers from "@/lib/database/customers/getComprehensiveCustomers";
import getCustomersByDoorbell from "@/lib/database/customers/getCustomersByDoorbell";
import updateCustomerFromAdmin from "@/lib/database/customers/updateCustomerFromAdmin";
import updateCustomerFromOrder from "@/lib/database/customers/updateCustomerFromOrder";
import createCustomer from "@/lib/database/customers/createCustomer";
import updateCustomerAddresses from "@/lib/database/customers/updateCustomerAddresses";
import updateCustomerOrderNotes from "@/lib/database/customers/updateCustomerOrderNotes";
import toggleCustomer from "@/lib/database/customers/toggleCustomer";
import deleteCustomerById from "@/lib/database/customers/deleteCustomerById";
import computeCustomersStats from "@/lib/database/customers/computeCustomersStats";

export const customersRouter = createTRPCRouter({
  getByPhone: publicProcedure
    .input(CustomerContracts.GetByPhone.Input)
    .output(CustomerContracts.GetByPhone.Output)
    .query(({ input }) => getCustomerByPhone(input)),

  getComprehensive: publicProcedure
    .input(CustomerContracts.GetComprehensive.Input)
    .output(CustomerContracts.GetComprehensive.Output)
    .query(({ input }) => getComprehensiveCustomer(input)),

  getAllComprehensive: publicProcedure
    .input(CustomerContracts.GetAllComprehensive.Input)
    .output(CustomerContracts.GetAllComprehensive.Output)
    .query(({ input }) => getComprehensiveCustomers(input)),

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
