import { Br, Line, Text } from "react-thermal-printer";
import { HomeOrder } from "@/app/(site)/models";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";

export default function OrderInfoSection(
  order: HomeOrder,
  quickPaymentOption?: QuickPaymentOption
) {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  return (
    <>
      {(order.home_order?.customer.preferences || order.home_order?.notes) && (
        <>
          {order.home_order?.customer.preferences && (
            <>
              <Text bold inline size={smallSize}>
                Preferenze:{" "}
              </Text>
              <Text size={bigSize}>
                {sanitazeReceiptText(order.home_order.customer.preferences)}
              </Text>
              {!order.home_order?.notes && <Br />}
            </>
          )}
          {order.home_order?.notes && (
            <>
              <Text bold inline size={smallSize}>
                Note ordine:{" "}
              </Text>
              <Text size={bigSize}>{sanitazeReceiptText(order.home_order.notes)}</Text>
              {/* <Br /> */}
            </>
          )}
          <Line />
          {/* <Br /> */}
        </>
      )}

      <Text bold inline size={smallSize}>
        Via:{" "}
      </Text>
      <Text inline size={bigSize}>
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
          <Text inline size={bigSize}>
            {sanitazeReceiptText(order.home_order?.address.street_info)}
          </Text>
          <Br />
        </>
      )}

      <Text bold inline size={smallSize}>
        Campanello:{" "}
      </Text>
      <Text inline size={bigSize}>
        {sanitazeReceiptText(order.home_order?.address.doorbell)}
      </Text>
      <Br />

      {(order.home_order?.address.floor || order.home_order?.address.stair) && (
        <>
          {order.home_order?.address.floor && (
            <>
              <Text bold inline size={smallSize}>
                Piano:{" "}
              </Text>
              <Text inline={order.home_order?.address.stair !== ""} size={bigSize}>
                {sanitazeReceiptText(order.home_order.address.floor)}
              </Text>

              {order.home_order?.address.stair !== "" && (
                <Text inline size={bigSize}>
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
              <Text size={bigSize}>{sanitazeReceiptText(order.home_order.address.stair)}</Text>
            </>
          )}
        </>
      )}

      {quickPaymentOption !== "none" && (
        <>
          <Text bold inline size={smallSize}>
            Tipo pagamento:{" "}
          </Text>
          <Text size={bigSize}>
            {quickPaymentOption === "cash"
              ? "CONTANTI"
              : quickPaymentOption === "already_paid"
              ? " GIA' PAGATO"
              : "CARTA"}
          </Text>
        </>
      )}

      <Text bold inline size={smallSize}>
        Quando:{" "}
      </Text>
      <Text size={bigSize}>
        {order.home_order?.when !== "immediate" ? order.home_order?.when : "PRIMA POSSIBILE"}
      </Text>

      <Text bold inline size={smallSize}>
        Tel:{" "}
      </Text>
      <Text size={bigSize}>
        {order.home_order?.customer.phone?.phone}
        {order.home_order?.contact_phone !== "" && " oppure " + order.home_order?.contact_phone}
      </Text>

      <Br />
    </>
  );
}
