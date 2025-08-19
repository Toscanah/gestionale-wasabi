import { OrderType, PlannedPayment } from "@prisma/client";
import { AnyOrder, HomeOrder } from "../../lib/shared";
import KitchenReceipt from "../../(domains)/printing/receipts/KitchenReceipt";
import OrderReceipt from "../../(domains)/printing/receipts/OrderReceipt";
import RiderReceipt from "../../(domains)/printing/receipts/RiderReceipt";
import EngagementReceipt from "../../(domains)/printing/receipts/EngagementReceipt";
import print, { PrintContent } from "../../(domains)/printing/print";
import { useOrderContext } from "../../context/OrderContext";
import usePrinter from "./usePrinter";
import fetchRequest from "../../lib/api/fetchRequest";

interface UsePrintingActionsParams {
  maybeSendConfirmation?: (order: AnyOrder) => Promise<void>;
}

export default function usePrintingActions({ maybeSendConfirmation }: UsePrintingActionsParams) {
  const { updateUnprintedProducts, toggleDialog, updatePrintedFlag, issueLedgers } =
    useOrderContext();
  const { printKitchen, printOrder, printRider, printEngagements } = usePrinter();

  async function buildPrintContent(
    order: AnyOrder,
    plannedPayment: PlannedPayment,
    isRePrint = false
  ) {
    const content: PrintContent[] = [];

    if (!isRePrint && !order.suborder_of) {
      const unprintedProducts = await updateUnprintedProducts();
      if (unprintedProducts.length > 0) {
        content.push(() => KitchenReceipt({ order: { ...order, products: unprintedProducts } }));
      }
    } else {
      content.push(() => KitchenReceipt({ order }));
    }

    content.push(() =>
      OrderReceipt({ order, plannedPayment, putInfo: order.type === OrderType.HOME })
    );

    if (order.type === OrderType.HOME) {
      content.push(() => RiderReceipt({ order: order as HomeOrder, plannedPayment }));
    }

    content.push(() => EngagementReceipt({ engagements: order.engagements }));

    return content;
  }

  // ---------- High-level orchestrated actions ----------

  async function handleKitchenRePrint(order: AnyOrder) {
    await printKitchen({ order });
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
