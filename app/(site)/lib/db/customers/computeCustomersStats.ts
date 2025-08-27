import getCustomersWithDetails from "./getCustomersWithDetails";
import countCustomers from "./util/countCustomers";
import { CustomerSchemaInputs } from "../../shared";
import { GetCustomersWithStatsResponse } from "../../shared/types/responses/customer";
import calculateCustomerStats from "../../services/customer-management/calculateCustomerStats";
import extractCustomerOrders from "../../services/customer-management/extractCustomerOrders";
import updateCustomerRFM from "./updateCustomerRFM";
import { prepareRFMInputs } from "../../services/rfm/prepareRFMInputs";
import buildCustomerWhere from "./util/buildCustomerWhere";

export default async function computeCustomersStats({
  page,
  pageSize,
  filters,
  rfmConfig,
}: CustomerSchemaInputs["ComputeCustomersStatsInput"]): Promise<GetCustomersWithStatsResponse> {
  const { from, to, ...otherFilters } = filters || {};

  console.log(from, to)

  const totalCount = await countCustomers({ ...otherFilters });
  const customers = await getCustomersWithDetails({ page, pageSize, filters: otherFilters });

  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const { lifetimeOrders, dateFilteredOrders } = extractCustomerOrders(customer, from, to);
      const { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered } =
        prepareRFMInputs(dateFilteredOrders, lifetimeOrders);

      const updatedRFM = await updateCustomerRFM({
        customer,
        rfmConfig,
        dateFilteredOrdersCount,
        lastOrderDateLifetime,
        averageSpendingFiltered,
      });

      const stats = calculateCustomerStats(
        dateFilteredOrders,
        lifetimeOrders,
        dateFilteredOrdersCount,
        lastOrderDateLifetime,
        averageSpendingFiltered
      );

      return {
        ...customer,
        ...stats,
        rfm: { ...updatedRFM.rfm },
      };
    })
  );

  return {
    customers: customersWithStats,
    totalCount,
  };
}
