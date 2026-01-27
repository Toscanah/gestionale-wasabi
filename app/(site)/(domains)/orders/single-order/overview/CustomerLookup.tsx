import { EnDash, NA } from "@/components/shared/misc/Placeholders";
import { useOrderContext } from "@/context/OrderContext";
import useRfmRanks from "@/hooks/rfm/useRfmRanks";
import useRfmRules from "@/hooks/rfm/useRfmRules";
import extractCustomerOrders from "@/lib/services/customer-management/extractCustomerOrders";
import calculateRFM from "@/lib/services/rfm/calculateRFM";
import calculateRfmRank from "@/lib/services/rfm/calculateRfmRank";
import calculateRfmScore from "@/lib/services/rfm/calculateRfmScore";
import { prepareRFMInputs } from "@/lib/services/rfm/prepareRFMInputs";
import { ComprehensiveCustomer, CUSTOMER_ORIGIN_LABELS } from "@/lib/shared";
import { OrderGuards } from "@/lib/shared/types/_index";
import { trpc } from "@/lib/trpc/client";
import { CustomerOrigin } from "@/prisma/generated/client/enums";

export default function CustomerLookup() {
  const { order } = useOrderContext();
  const { rfmRules } = useRfmRules();
  const { ranks } = useRfmRanks();

  if (OrderGuards.isTable(order)) return null;

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

  const customerId = getCustomerId();
  const { data: customer } = trpc.customers.getComprehensive.useQuery(
    { customerId: customerId! },
    {
      enabled: !!customerId,
      staleTime: Infinity,
      select: (c) => (c ? filterOutCurrentOrder(c) : undefined),
    }
  );

  if (!customer) return null;

  const hasOrders =
    (customer.home_orders?.length ?? 0) > 0 || (customer.pickup_orders?.length ?? 0) > 0;
  if (!hasOrders) return null;

  const { lifetimeOrders } = extractCustomerOrders(customer);

  const rfm = calculateRFM(lifetimeOrders);
  // console.log("RFM for customer", customer.id, rfm);
  const rfmScore = calculateRfmScore(rfm, rfmRules);
  // console.log("RFM Score for customer", customer.id, rfmScore);
  const rfmRank = calculateRfmRank(rfmScore, ranks);

  const origin = OrderGuards.isHome(order)
    ? order.home_order.customer.origin
    : OrderGuards.isPickup(order)
      ? (order.pickup_order.customer?.origin ?? CustomerOrigin.UNKNOWN)
      : CustomerOrigin.UNKNOWN;

  return (
    <div className="w-full h-12 text-lg border rounded-lg p-2 flex justify-around items-center">
      <span>
        <strong>Origine:</strong> {CUSTOMER_ORIGIN_LABELS[origin]}
      </span>

      <span>
        <strong>Rank RFM:</strong> {rfmRank ? rfmRank : <EnDash />}
      </span>
    </div>
  );
}
