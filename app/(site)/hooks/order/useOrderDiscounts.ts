import { ordersAPI, promotionsAPI } from "@/lib/server/api";
import { OrderByType } from "../../lib/shared";
import { toastSuccess, toastError } from "../../lib/utils/global/toast";
import { RecursivePartial } from "./useOrderManager";

export default function useOrderDiscounts(
  order: OrderByType,
  updateOrder: (newOrder: RecursivePartial<OrderByType>) => void
) {
  const { mutate: updateDiscountMutation } = ordersAPI.updateManualDiscount.useMutation();
  const { mutate: applyPromoMutation } = promotionsAPI.applyToOrder.useMutation();
  const { mutate: removePromoMutation } = promotionsAPI.removeFromOrder.useMutation();
  const { mutateAsync: rebalanceMutation } = promotionsAPI.rebalanceOrderPromotions.useMutation();

  const updateOrderDiscount = (discount: number) => {
    const safeDiscount = Math.min(Math.max(discount, 0), 100);

    updateDiscountMutation(
      { orderId: order.id, discount: safeDiscount },
      {
        onSuccess: (updatedOrder) => {
          toastSuccess("Sconto aggiornato correttamente");
          updateOrder({
            discount: updatedOrder.discount,
            is_receipt_printed: false,
          });
        },
        onError: (err) => {
          toastError(err.message ?? "Errore durante l'aggiornamento dello sconto");
        },
      }
    );
  };

  const applyPromotionToOrder = (promoCode: string, amount?: number) => {
    applyPromoMutation(
      { orderId: order.id, code: promoCode.trim(), amount },
      {
        onSuccess: (updatedOrder) => {
          updateOrder({
            promotion_usages: updatedOrder.promotion_usages,
            is_receipt_printed: false,
          });
          toastSuccess(`Promozione "${promoCode}" applicata con successo`);
        },
        onError: (err) => {
          toastError(err.message ?? "Errore durante l'applicazione della promozione");
        },
      }
    );
  };

  const removePromotionFromOrder = (usageId: number) => {
    removePromoMutation(
      { usageId },
      {
        onSuccess: (updatedOrder) => {
          updateOrder({
            promotion_usages: updatedOrder.promotion_usages,
            is_receipt_printed: false,
          });
          toastSuccess("Promozione rimossa correttamente");
        },
        onError: (err) => {
          toastError(err.message ?? "Errore durante la rimozione della promozione");
        },
      }
    );
  };

  const rebalanceOrderPromotions = async () => {
    const updatedOrder = await rebalanceMutation({ orderId: order.id });
    return updatedOrder;
  };

  return {
    updateOrderDiscount,
    applyPromotionToOrder,
    removePromotionFromOrder,
    rebalanceOrderPromotions,
  };
}
