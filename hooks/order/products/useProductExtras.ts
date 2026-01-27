import { ExtraItems } from "@/domains/orders/single-order/overview/ExtraItems";
import calculateExtraItems from "@/lib/services/order-management/calculateExtraItems";
import { OrderByType, ProductInOrder } from "@/lib/shared";
import { ordersAPI } from "@/lib/trpc/api";

type UseProductExtrasParams = {
  order: OrderByType;
};

export default function useProductExtras({ order }: UseProductExtrasParams) {
  const updateExtraMutation = ordersAPI.updateExtraItems.useMutation();

  const computeAndUpdateExtras = (finalProducts: ProductInOrder[]) => {
    const {
      soupsFromProducts: oldSoups,
      saladsFromProducts: oldSalads,
      ricesFromProducts: oldRices,
    } = calculateExtraItems(order);

    const {
      soupsFromProducts: newSoups,
      saladsFromProducts: newSalads,
      ricesFromProducts: newRices,
    } = calculateExtraItems({ ...order, products: finalProducts });

    const deltaSoups = newSoups - oldSoups;
    const deltaSalads = newSalads - oldSalads;
    const deltaRices = newRices - oldRices;

    const locked = order.soups !== null || order.salads !== null || order.rices !== null;

    let extraUpdates: Partial<Record<ExtraItems, number | null>> = {};

    if (locked) {
      // FIX: Removed the check (newValues < order.values) which was forcing a reset
      // when manual items were higher than product-generated items.
      const newValues: Partial<Record<ExtraItems, number | null>> = {
        soups: order.soups !== null ? Math.max(0, order.soups! + deltaSoups) : null,
        salads: order.salads !== null ? Math.max(0, order.salads! + deltaSalads) : null,
        rices: order.rices !== null ? Math.max(0, order.rices! + deltaRices) : null,
      };

      (Object.entries(newValues) as [ExtraItems, number | null][])
        .filter(([key, value]) => order[key] !== value)
        .forEach(([key, value]) => {
          updateExtraMutation.mutate({
            orderId: order.id,
            items: key,
            value,
          });
          extraUpdates[key] = value;
        });
    } else {
      extraUpdates = { soups: null, salads: null, rices: null };
    }

    return extraUpdates;
  };

  return { computeAndUpdateExtras };
}
