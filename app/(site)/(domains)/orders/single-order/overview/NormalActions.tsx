import { AnyOrder, HomeOrder } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { PayingAction } from "../OrderTable";
import print from "@/app/(site)/(domains)/printing/print";
import OrderReceipt from "@/app/(site)/(domains)/printing/receipts/OrderReceipt";
import RiderReceipt from "../../../printing/receipts/RiderReceipt";
import { OrderType, PaymentScope, QuickPaymentOption } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import KitchenReceipt from "@/app/(site)/(domains)/printing/receipts/KitchenReceipt";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import useMetaTemplates from "@/app/(site)/hooks/meta/useMetaTemplates";
import { useTemplatesParams } from "@/app/(site)/hooks/meta/useTemplatesParams";
import { ORDER_CONFIRMATION_TEMPLATE_NAME } from "@/app/(site)/lib/integrations/meta/constants";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useSettings from "@/app/(site)/hooks/useSettings";

interface NormalActionsProps {
  quickPaymentOption: QuickPaymentOption;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function NormalActions({ setAction, quickPaymentOption }: NormalActionsProps) {
  const { order, updateUnprintedProducts, updateOrder, toggleDialog, dialogOpen } =
    useOrderContext();

  const [rePrintDialog, setRePrintDialog] = useState<boolean>(false);
  const [paramsReady, setParamsReady] = useState(false);

  const hasConfirmationSent = useCallback(() => {
    return (
      order.type == OrderType.HOME &&
      (order as HomeOrder).home_order?.messages.some(
        (mess) => mess.template_name === ORDER_CONFIRMATION_TEMPLATE_NAME
      )
    );
  }, [order]);

  const { settings } = useWasabiContext();
  const { paramsMap, setParam } = useTemplatesParams();
  const shouldLoadTemplates = settings.useWhatsApp && dialogOpen;

  const { templates, sendMessages } = useMetaTemplates({
    open: shouldLoadTemplates,
    paramsMap,
  });

  useEffect(() => {
    const prepareParams = async () => {
      if (!hasConfirmationSent()) {
        const confermaTemplate = templates.find((t) => t.name === ORDER_CONFIRMATION_TEMPLATE_NAME);
        if (!confermaTemplate) return;

        const templateId = confermaTemplate.id;

        const when = (order as HomeOrder).home_order?.when;

        let finalWhen: string;

        if (when === "immediate") {
          const createdAt = new Date(order.created_at);
          const futureTime = new Date(createdAt.getTime() + 40 * 60000); // Add 40 minutes
          const hours = futureTime.getHours().toString().padStart(2, "0");
          const minutes = futureTime.getMinutes().toString().padStart(2, "0");
          finalWhen = `${hours}:${minutes}`;
        } else {
          finalWhen = when ?? "";
        }

        // setParam(templateId, "header_text", 1, "ORDINE_ID_PLACEHOLDER");
        setParam(templateId, "body_text", 1, finalWhen);
        setParam(templateId, "body_text", 2, "https://www.wasabi-trieste.it/politiche-di-ritardo");
        setParam(templateId, "button_url", 0, "/#");

        setParamsReady(true);
      } else {
        setParamsReady(true); // Already sent = nothing to prepare
      }
    };

    setParamsReady(false); // Reset before starting
    prepareParams();
  }, [order, hasConfirmationSent, templates]);

  useEffect(() => {
    const handlePrintShortcut = async (event: KeyboardEvent) => {
      if (event.altKey && event.key === "p") {
        await handlePrint();
      }
    };

    document.addEventListener("keydown", handlePrintShortcut);
    return () => {
      document.removeEventListener("keydown", handlePrintShortcut);
    };
  }, [order, order.products]);

  const canSplit = (products: ProductInOrder[]) =>
    products.length > 1 ||
    (products.length === 1 && products[0].quantity > 1 && order.type !== OrderType.HOME);

  const updatePrintedFlag = async () =>
    fetchRequest<boolean>("PATCH", "/api/orders", "updatePrintedFlag", {
      orderId: order.id,
    }).then((is_receipt_printed) => updateOrder({ is_receipt_printed }));

  const buildPrintContent = async (
    order: AnyOrder,
    quickPaymentOption: QuickPaymentOption,
    isRePrint = false
  ) => {
    const content = [];

    if (!isRePrint && !order.suborder_of) {
      const unprintedProducts = await updateUnprintedProducts();

      if (unprintedProducts.length > 0) {
        content.push(() => KitchenReceipt<typeof order>({ ...order, products: unprintedProducts }));
      }
    } else {
      content.push(() => KitchenReceipt<typeof order>(order));
    }

    content.push(() =>
      OrderReceipt<typeof order>(order, quickPaymentOption, order.type === OrderType.HOME)
    );

    if (order.type === OrderType.HOME) {
      content.push(() => RiderReceipt(order as HomeOrder, quickPaymentOption));
    }

    return content;
  };

  const handleKitchenRePrint = async () => await print(() => KitchenReceipt<typeof order>(order));

  const handleOrderRePrint = async () =>
    await print(
      () => OrderReceipt<typeof order>(order, quickPaymentOption, order.type === OrderType.HOME),
      ...(order.type === OrderType.HOME
        ? [() => RiderReceipt(order as HomeOrder, quickPaymentOption)]
        : [])
    );

  const handleFullRePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, true);
    await print(...content);
  };

  const handlePrint = async () => {
    await updatePrintedFlag();
    const content = await buildPrintContent(order, quickPaymentOption, false);
    await print(...content).then(() => toggleDialog(false));

    if (!hasConfirmationSent() && settings.useWhatsApp) {
      await sendMessages({
        templateName: ORDER_CONFIRMATION_TEMPLATE_NAME,
        order,
        toast: false,
      });
    }
  };

  const handleFullPayment = async () => {
    if (!order.is_receipt_printed) {
      await updatePrintedFlag();
      await print(() => OrderReceipt<typeof order>(order, quickPaymentOption, false, true));
    }

    setAction("payFull");
  };

  const hasProducts = order.products.filter((product) => product.id !== -1).length > 0;

  const RePrintButton = () => (
    <DialogWrapper
      open={rePrintDialog}
      onOpenChange={setRePrintDialog}
      title="Cosa vuoi re-stampare?"
      trigger={
        <Button className="w-full text-3xl h-12" disabled={!hasProducts}>
          Re-Stampa 重新打印
        </Button>
      }
    >
      <div className="flex gap-6">
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleKitchenRePrint().then(() => setRePrintDialog(false))}
        >
          Cucina 厨房
        </Button>
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleFullRePrint().then(() => setRePrintDialog(false))}
        >
          Tutto 所有
        </Button>
        <Button
          className="w-full text-4xl h-24"
          onClick={() => handleOrderRePrint().then(() => setRePrintDialog(false))}
        >
          Ordine 客人
        </Button>
      </div>
    </DialogWrapper>
  );

  return (
    <>
      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-12"
          onClick={() => setAction("payPart")}
          disabled={
            !canSplit(order.products.filter((product) => product.id !== -1)) ||
            order.payments.some((p) => p.scope === PaymentScope.ROMAN) ||
            order.type === OrderType.HOME
          }
        >
          Dividi 分单
        </Button>

        <Button
          onClick={() => setAction("payRoman")}
          className="w-full text-3xl h-12"
          disabled={
            order.type === OrderType.HOME || order.products.filter((p) => p.id !== -1).length === 0
          }
        >
          Romana
        </Button>
      </div>

      <RePrintButton />

      <div className="flex gap-6">
        <Button
          className="w-full text-3xl h-36"
          disabled={!hasProducts || (settings.useWhatsApp && !paramsReady)}
          onClick={handlePrint}
        >
          STAMPA 打印
        </Button>

        <Button
          className="w-full text-3xl h-36"
          onClick={handleFullPayment}
          disabled={!(getOrderTotal({ order }) > 0)}
        >
          INCASSA 收钱
        </Button>
      </div>
    </>
  );
}
