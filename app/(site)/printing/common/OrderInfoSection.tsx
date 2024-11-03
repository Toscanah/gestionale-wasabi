import { Br, Line, Text } from "react-thermal-printer";
import { HomeOrder } from "../../types/PrismaOrders";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";

export default function OrderInfoSection(
  order: HomeOrder,
  quickPaymentOption?: QuickPaymentOption
) {
  return (
    <>
      {order.home_order?.customer.preferences && (
        <>
          <Line />
          <Br />
          <Text bold>Pref: {order.home_order?.customer.preferences.toUpperCase()}</Text>
          <Line />
          <Br />
        </>
      )}

      <Text bold>Tel: {order.home_order?.customer.phone?.phone}</Text>

      <Text bold>
        Via:{" "}
        {(order.home_order?.address.street + " " + order.home_order?.address.civic).toUpperCase()}
      </Text>

      {order.home_order?.address.street_info && (
        <Text bold>Inf: {order.home_order?.address.street_info.toUpperCase()}</Text>
      )}

      <Text bold>Camp: {order.home_order?.address.doorbell.toUpperCase()}</Text>

      {order.home_order?.address.floor && (
        <Text bold>
          {order.home_order?.address.floor ? "Piano: " + order.home_order.address.floor : ""}
        </Text>
      )}

      {order.home_order?.address.stair && (
        <Text bold>
          {order.home_order?.address.stair ? "Scala: " + order.home_order.address.stair : ""}
        </Text>
      )}

      {quickPaymentOption !== "none" && (
        <Text bold>Pagam: {quickPaymentOption == "cash" ? "CONTANTI" : "CARTA"}</Text>
      )}

      <Text bold>
        Quando:{" "}
        {order.home_order?.when !== "immediate"
          ? '"' + order.home_order?.when + '"'
          : '"PRIMA POSSIBILE"'}
      </Text>
    </>
  );
}
