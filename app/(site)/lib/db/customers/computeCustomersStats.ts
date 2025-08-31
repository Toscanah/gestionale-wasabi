import getCustomersWithDetails from "./getCustomersWithDetails";
import countCustomers from "./util/countCustomers";
import { CustomerContract } from "../../shared";
import calculateCustomerStats from "../../services/customer-management/calculateCustomerStats";
import extractCustomerOrders from "../../services/customer-management/extractCustomerOrders";
import updateCustomerRFM from "./updateCustomerRFM";
import { prepareRFMInputs } from "../../services/rfm/prepareRFMInputs";
import normalizePeriod from "../../utils/global/date/normalizePeriod";

export default async function computeCustomersStats({
  page,
  pageSize,
  filters,
}: CustomerContract["Requests"]["ComputeCustomersStats"]): Promise<
  CustomerContract["Responses"]["ComputeCustomersStats"]
> {
  const { period, ...otherFilters } = filters || {};

  console.log(otherFilters)

  const normalizedPeriod = normalizePeriod(period);

  const totalCount = await countCustomers({ ...otherFilters });
  const customers = await getCustomersWithDetails({ page, pageSize, filters: otherFilters });

  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const { lifetimeOrders, dateFilteredOrders } = extractCustomerOrders(
        customer,
        normalizedPeriod?.from,
        normalizedPeriod?.to
      );
      const { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered } =
        prepareRFMInputs(dateFilteredOrders, lifetimeOrders);

      const stats = calculateCustomerStats(
        dateFilteredOrders,
        dateFilteredOrdersCount,
        lastOrderDateLifetime,
        averageSpendingFiltered
      );

      return {
        ...customer,
        ...stats,
      };
    })
  );

  return {
    customers: customersWithStats,
    totalCount,
  };
}
