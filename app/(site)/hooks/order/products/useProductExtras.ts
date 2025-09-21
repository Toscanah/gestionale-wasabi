import { ExtraItems } from "@/app/(site)/(domains)/orders/single-order/overview/ExtraItems";
import calculateExtraItems from "@/app/(site)/lib/services/order-management/calculateExtraItems";
import { AnyOrder, ProductInOrder } from "@/app/(site)/lib/shared";
import { ordersAPI } from "@/lib/server/api";

type UseProductExtrasParams = {
  order: AnyOrder;
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
      const newValues: Partial<Record<ExtraItems, number | null>> = {
        soups:
          order.soups !== null
            ? newSoups < order.soups!
              ? null
              : order.soups! + deltaSoups // 👉 fallback to auto if smaller
            : null,
        salads:
          order.salads !== null
            ? newSalads < order.salads!
              ? null
              : order.salads! + deltaSalads
            : null,
        rices:
          order.rices !== null
            ? newRices < order.rices!
              ? null
              : order.rices! + deltaRices
            : null,
      };

      (Object.entries(newValues) as [ExtraItems, number | null][])
        .filter(([key, value]) => order[key] !== value)
        .forEach(([key, value]) => {
          updateExtraMutation.mutate({
            orderId: order.id,
            items: key,
            value, // can be null -> unlocks auto mode
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
