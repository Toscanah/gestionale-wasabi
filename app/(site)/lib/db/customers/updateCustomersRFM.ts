import extractCustomerOrders from "../../services/customer-management/extractCustomerOrders";
import { CustomerSchemaInputs } from "../../shared";

export default async function updateCustomersRFM({
  customers,
  rfmConfig,
}: CustomerSchemaInputs["UpdateCustomersRFMInput"]) {
  customers.map(async (customer) => {
    
    const { lifetimeOrders, dateFilteredOrders } = extractCustomerOrders(customer, from, to);
    const { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered } =
      prepareRFMInputs(dateFilteredOrders, lifetimeOrders);
  }


}
