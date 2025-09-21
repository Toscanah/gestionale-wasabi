import { OrderType, PlannedPayment } from "@prisma/client";
import { AnyOrder, HomeOrder } from "../../lib/shared";
import KitchenReceipt from "../../(domains)/printing/receipts/KitchenReceipt";
import OrderReceipt from "../../(domains)/printing/receipts/OrderReceipt";
import RiderReceipt from "../../(domains)/printing/receipts/RiderReceipt";
import EngagementReceipt from "../../(domains)/printing/receipts/EngagementReceipt";
import print, { PrintContent } from "../../(domains)/printing/print";
import { useOrderContext } from "../../context/OrderContext";
import usePrinter from "./usePrinter";

interface UsePrintingActionsParams {
  maybeSendConfirmation?: (order: AnyOrder) => Promise<void>;
}

export default function usePrintingActions({ maybeSendConfirmation }: UsePrintingActionsParams) {
  const { updatePrintedProducts, toggleDialog, updatePrintedFlag, issueLedgers } =
    useOrderContext();
  const { printKitchen, printOrder, printRider, printEngagements } = usePrinter();

  function getAtomicProducts(order: AnyOrder) {
    return order.products.map((p) => ({
      ...p,
      to_be_printed: p.quantity,
    }));
  }

  async function buildPrintContent(
    order: AnyOrder,
    plannedPayment: PlannedPayment,
    isRePrint = false
  ) {
    const content: PrintContent[] = [];
    const unprintedProducts = await updatePrintedProducts();

    if (!isRePrint && !order.suborder_of) {
      if (unprintedProducts.length > 0) {
        content.push(() => KitchenReceipt({ order: { ...order, products: unprintedProducts } }));
      }
    } else {
      const allProducts = getAtomicProducts(order);

      if (allProducts.length > 0) {
        content.push(() => KitchenReceipt({ order: { ...order, products: allProducts } }));
      }
    }

    content.push(() =>
      OrderReceipt({ order, plannedPayment, putInfo: order.type == OrderType.TABLE ? false : true })
    );

    if (order.type === OrderType.HOME) {
      content.push(() => RiderReceipt({ order: order as HomeOrder, plannedPayment }));
    }

    const redeemableEngagements = order.engagements.filter((e) => e.template.redeemable);
    if (redeemableEngagements.length > 0) {
      content.push(() => EngagementReceipt({ engagements: redeemableEngagements }));
    }

    return content;
  }

  // ---------- High-level orchestrated actions ----------

  async function handleKitchenRePrint(order: AnyOrder) {
    await updatePrintedProducts();
    const allProducts = getAtomicProducts(order);
    await printKitchen({
      order: { ...order, products: allProducts },
    });
  }

  async function handleOrderRePrint(order: AnyOrder, plannedPayment: PlannedPayment) {
    const content: PrintContent[] = [];

    content.push(() =>
      OrderReceipt({
        order,
        plannedPayment,
        putInfo: order.type === OrderType.HOME,
      })
    );

    if (order.type === OrderType.HOME) {
      content.push(
        () => RiderReceipt({ order: order as HomeOrder, plannedPayment }),
        () => EngagementReceipt({ engagements: order.engagements })
      );
    }

    await print(...content);
  }

  async function handleFullRePrint(order: AnyOrder, plannedPayment: PlannedPayment) {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, plannedPayment, true);
    await print(...content);
  }

  async function handlePrint(order: AnyOrder, plannedPayment: PlannedPayment) {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, plannedPayment, false);
    await issueLedgers(order);
    await print(...content).then(() => toggleDialog(false));
    await maybeSendConfirmation?.(order);
  }

  // ---------- Export all ----------
  return {
    printKitchen,
    printOrder,
    printRider,
    printEngagements,
    handleKitchenRePrint,
    handleOrderRePrint,
    handleFullRePrint,
    handlePrint,
  };
}
