import { useOrderContext } from "@/app/(site)/context/OrderContext";
import useRfmRanks from "@/app/(site)/hooks/rfm/useRfmRanks";
import useRfmRules from "@/app/(site)/hooks/rfm/useRfmRules";
import extractCustomerOrders from "@/app/(site)/lib/services/customer-management/extractCustomerOrders";
import calculateRFM from "@/app/(site)/lib/services/rfm/calculateRFM";
import calculateRfmRank from "@/app/(site)/lib/services/rfm/calculateRfmRank";
import calculateRfmScore from "@/app/(site)/lib/services/rfm/calculateRfmScore";
import { prepareRFMInputs } from "@/app/(site)/lib/services/rfm/prepareRFMInputs";
import { ComprehensiveCustomer, CUSTOMER_ORIGIN_LABELS } from "@/app/(site)/lib/shared";
import { OrderGuards } from "@/app/(site)/lib/shared/types/_index";
import { trpc } from "@/lib/server/client";

export default function CustomerLookup() {
  const { order } = useOrderContext();
  const { rfmRules } = useRfmRules();
  const { ranks } = useRfmRanks();

  // No RFM for table orders
  if (OrderGuards.isTable(order)) return null;

  // ---- Helpers ----
  const getCustomerId = () => {
    if (OrderGuards.isPickup(order)) return order.pickup_order?.customer_id;
    if (OrderGuards.isHome(order)) return order.home_order?.customer_id;
    return undefined;
  };

  const filterOutCurrentOrder = (customer: ComprehensiveCustomer) => {
    if (OrderGuards.isHome(order)) {
      return {
        ...customer,
        home_orders: customer.home_orders.filter((h) => h.id !== order.id),
      };
    }
    if (OrderGuards.isPickup(order)) {
      return {
        ...customer,
        pickup_orders: customer.pickup_orders.filter((p) => p.id !== order.id),
      };
    }
    return customer;
  };

  // ---- Fetch customer ----
  const customerId = getCustomerId();
  const { data: customer } = trpc.customers.getComprehensive.useQuery(
    { customerId: customerId! },
    {
      enabled: !!customerId,
      staleTime: Infinity,
      select: (c) => (c ? filterOutCurrentOrder(c) : undefined),
    }
  );

  console.log("AA?????")
  if (!customer) return null;

  const hasOrders =
    (customer.home_orders?.length ?? 0) > 0 || (customer.pickup_orders?.length ?? 0) > 0;
  if (!hasOrders) return null;


  // ---- RFM calculation ----
  const { lifetimeOrders } = extractCustomerOrders(customer);
  const rfmInputs = prepareRFMInputs(lifetimeOrders);

  const mostRecent = lifetimeOrders.reduce(
    (latest, o) => (o.created_at > latest.created_at ? o : latest),
    lifetimeOrders[0]
  );

  const rfm = calculateRFM(mostRecent.created_at, rfmInputs.orderCount, rfmInputs.averageSpending);
  const rfmScore = calculateRfmScore(rfm, rfmRules);
  const rfmRank = calculateRfmRank(rfmScore, ranks);

  // ---- Render ----
  const origin = OrderGuards.isHome(order)
    ? order.home_order.customer.origin
    : OrderGuards.isPickup(order)
      ? (order.pickup_order.customer?.origin ?? "UNKNOWN")
      : "UNKNOWN";

  return (
    <span>
      {CUSTOMER_ORIGIN_LABELS[origin]} {rfmRank}
    </span>
  );
}
