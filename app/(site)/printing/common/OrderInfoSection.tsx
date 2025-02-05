import { Br, Line, Text } from "react-thermal-printer";
import { HomeOrder } from "@/app/(site)/models";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";
import { QuickPaymentOption } from "@prisma/client";
import calculateExtraItems from "../../functions/order-management/calculateExtraItems";

interface OrderInfoSectionProps {
  order: HomeOrder;
  quickPaymentOption?: QuickPaymentOption;
  extraItems?: boolean;
  when?: boolean;
}

export default function OrderInfoSection({
  order,
  quickPaymentOption,
  extraItems = true,
  when = true,
}: OrderInfoSectionProps) {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const { ricesFinal, soupsFinal, saladsFinal } = calculateExtraItems(order);

  const hasSoups = soupsFinal > 0;
  const hasSalads = saladsFinal > 0;
  const hasRices = ricesFinal > 0;

  return (
    <>
      {extraItems && (hasSoups || hasSalads || hasRices) && (
        <>
          {hasSoups && (
            <>
              <Text bold inline size={smallSize}>
                Zuppe:{" "}
              </Text>
              <Text inline size={smallSize}>
                {soupsFinal}
              </Text>
            </>
          )}

          {hasSoups && (hasSalads || hasRices) && (
            <Text inline size={smallSize}>
              {", "}
            </Text>
          )}

          {hasSalads && (
            <>
              <Text bold inline size={smallSize}>
                Insalate:{" "}
              </Text>
              <Text inline size={smallSize}>
                {saladsFinal}
              </Text>
            </>
          )}

          {hasSalads && hasRices && (
            <Text inline size={smallSize}>
              {", "}
            </Text>
          )}

          {hasRices && (
            <>
              <Text bold inline size={smallSize}>
                Riso:{" "}
              </Text>
              <Text inline size={smallSize}>
                {ricesFinal}
              </Text>
            </>
          )}
        </>
      )}

      {extraItems && (hasSoups || hasSalads || hasRices) && <Br />}

      {(order.home_order?.customer.preferences || order.home_order?.notes) && (
        <>
          {order.home_order?.customer.preferences && (
            <>
              <Text bold inline size={smallSize}>
                Preferenze:{" "}
              </Text>
              <Text size={smallSize}>
                {sanitazeReceiptText(order.home_order.customer.preferences)}
              </Text>
            </>
          )}
          {order.home_order?.notes && (
            <>
              <Text bold inline size={smallSize}>
                Note ordine:{" "}
              </Text>
              <Text size={smallSize}>{order.home_order.notes}</Text>
            </>
          )}
        </>
      )}

      <Text size={bigSize}>{sanitazeReceiptText(order.home_order?.address.doorbell)}</Text>
      <Line />

      <Text bold inline size={smallSize}>
        Via:{" "}
      </Text>
      <Text inline size={smallSize}>
        {sanitazeReceiptText(
          order.home_order?.address.street + " " + order.home_order?.address.civic
        ).toUpperCase()}
      </Text>
      <Br />

      {order.home_order?.address.street_info && (
        <>
          <Text bold inline size={smallSize}>
            Informazioni strad:{" "}
          </Text>
          <Text inline size={smallSize}>
            {sanitazeReceiptText(order.home_order?.address.street_info)}
          </Text>
          <Br />
        </>
      )}

      {(order.home_order?.address.floor || order.home_order?.address.stair) && (
        <>
          {order.home_order?.address.floor && (
            <>
              <Text bold inline size={smallSize}>
                Piano:{" "}
              </Text>
              <Text inline={order.home_order?.address.stair !== ""} size={smallSize}>
                {sanitazeReceiptText(order.home_order.address.floor)}
              </Text>

              {order.home_order?.address.stair !== "" && (
                <Text inline size={smallSize}>
                  {", "}
                </Text>
              )}
            </>
          )}
          {order.home_order?.address.stair && (
            <>
              <Text bold inline size={smallSize}>
                Scala:{" "}
              </Text>
              <Text size={smallSize}>{sanitazeReceiptText(order.home_order.address.stair)}</Text>
            </>
          )}
        </>
      )}

      {quickPaymentOption !== QuickPaymentOption.UNKNOWN && (
        <>
          <Text bold inline size={smallSize}>
            Tipo pagamento:{" "}
          </Text>
          <Text size={smallSize}>
            {sanitazeReceiptText(
              quickPaymentOption === "CASH"
                ? "CONTANTI"
                : quickPaymentOption === "ALREADY_PAID"
                ? " GIA' PAGATO"
                : "CARTA"
            )}
          </Text>
        </>
      )}

      <Text bold inline size={smallSize}>
        Telefono:{" "}
      </Text>
      <Text size={smallSize}>
        {order.home_order?.customer.phone?.phone}
        {order.home_order?.contact_phone !== "" && " oppure " + order.home_order?.contact_phone}
      </Text>

      {when && (
        <>
          <Line />
          <Text size={bigSize}>
            {order.home_order?.when !== "immediate" ? order.home_order?.when : "PRIMA POSSIBILE"}
          </Text>
        </>
      )}
    </>
  );
}
