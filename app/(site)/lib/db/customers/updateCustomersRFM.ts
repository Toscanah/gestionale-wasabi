import extractCustomerOrders from "../../services/customer-management/extractCustomerOrders";
import { prepareRFMInputs } from "../../services/rfm/prepareRFMInputs";
import { CustomerContract } from "../../shared";
import getCustomersWithDetails from "./getCustomersWithDetails";
import updateCustomerRFM from "./updateCustomerRFM";

export default async function updateCustomersRFM({
  rfmConfig,
}: CustomerContract["Requests"]["UpdateCustomersRFM"]) {
  return await Promise.all(
    (
      await getCustomersWithDetails()
    ).map(async (customer) => {
      const { lifetimeOrders } = extractCustomerOrders(customer);
      const { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered } =
        prepareRFMInputs(lifetimeOrders, lifetimeOrders);

      await updateCustomerRFM({
        customer,
        rfmConfig,
        dateFilteredOrdersCount,
        lastOrderDateLifetime,
        averageSpendingFiltered,
      });
    })
  );
}
