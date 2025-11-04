import { ordersAPI, promotionsAPI } from "@/lib/server/api";
import { OrderByType } from "../../lib/shared";
import { useCallback } from "react";
import { debounce } from "lodash";
import { toastSuccess, toastError } from "../../lib/utils/global/toast";
import { RecursivePartial } from "./useOrderManager";
import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import { PromotionUsage } from "@prisma/client";

export default function useOrderDiscount(
  order: OrderByType,
  updateOrder: (newOrder: RecursivePartial<OrderByType>) => void
) {
  const { mutate: updateDiscountMutation } = ordersAPI.updateDiscount.useMutation();
  const { mutate: applyPromoMutation } = promotionsAPI.applyPromotion.useMutation();
  // const { mutate: removePromoMutation } = promotionsAPI.placeholderName.removePromotion;

  const updateOrderDiscount = (discount: number) => {
    const safeDiscount = Math.min(Math.max(discount, 0), 100);

    const newTotal = getOrderTotal({
      order: { ...order, discount: safeDiscount },
      applyDiscounts: true,
    });

    if (newTotal < 0) return toastError("Lo sconto è troppo alto rispetto al totale dell'ordine");

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
      }
    );
  };

  // --- Promotions ---
  const applyPromotion = (promoCode: string) => {
    applyPromoMutation(
      {
        orderId: order.id,
        code: promoCode,
      },
      {
        onSuccess: (promoUsage) => {
          const updatedOrder = {
            ...order,
            promotion_usages: [...(order.promotion_usages ?? []), promoUsage],
          };

          const newTotal = getOrderTotal({
            order: updatedOrder,
            applyDiscounts: true,
          });
        },
        onError: (err) => {
          toastError(err.message ?? "Errore durante l'applicazione della promozione");
        },
      }
    );

    if (newTotal < 0) {
      toastError("La promozione porterebbe il totale sotto zero");
      return;
    }

    updateOrder({
      promotion_usages: updatedOrder.promotion_usages,
      is_receipt_printed: false,
    });

    toastSuccess(`Promozione "${promoCode}" applicata con successo`);
    toastError(err?.message ?? "Errore durante l'applicazione della promozione");
  };

  // const removePromotion = async (promotionId: number) => {
  //   try {
  //     await removePromoMutation({
  //       orderId: order.id,
  //       promotionId,
  //     });

  //     const updatedPromos = (order.promotion_usages ?? []).filter(
  //       (u) => u.promotion_id !== promotionId
  //     );

  //     const updatedOrder = { ...order, promotion_usages: updatedPromos };
  //     const newTotal = getOrderTotal({
  //       order: updatedOrder,
  //       applyDiscounts: true,
  //     });

  //     if (newTotal < 0) {
  //       toastError("Errore: il totale è negativo dopo la rimozione della promozione");
  //       return;
  //     }

  //     updateOrder({
  //       promotion_usages: updatedPromos,
  //       is_receipt_printed: false,
  //     });

  //     toastSuccess("Promozione rimossa correttamente");
  //   } catch (err) {
  //     toastError("Errore durante la rimozione della promozione");
  //   }
  // };

  return {
    updateOrderDiscount,
    applyPromotion,
    // removePromotion,
  };
}
