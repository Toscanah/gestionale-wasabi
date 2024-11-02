import { Text, TextSize } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";

export default function OrderInfoSection(order: AnyOrder, quickPaymentOption?: QuickPaymentOption) {
  const size: { width: TextSize; height: TextSize } = { width: 2, height: 2 };

  return (
    <>
      {"home_order" in order && (
        <>
          <Text bold size={size}>
            {order.home_order?.customer.phone?.phone}
          </Text>

          <Text bold size={size}>
            {(
              order.home_order?.address.street +
              " " +
              order.home_order?.address.civic
            ).toUpperCase()}
          </Text>

          {order.home_order?.address.street_info && (
            <Text bold size={size}>
              {order.home_order?.address.street_info.toUpperCase()}
            </Text>
          )}

          <Text bold size={size}>
            {order.home_order?.address.doorbell.toUpperCase()}
          </Text>

          {(order.home_order?.address.floor || order.home_order?.address.stair) && (
            <Text bold size={size}>
              {order.home_order?.address.floor ? `${order.home_order.address.floor} PIANO` : ""}
              {order.home_order?.address.floor && order.home_order?.address.stair ? ", " : ""}
              {order.home_order?.address.stair ? `SCALA ${order.home_order.address.stair}` : ""}
            </Text>
          )}

          {quickPaymentOption !== "none" && (
            <Text bold size={size}>
              {quickPaymentOption == "cash" ? "CONTANTI" : "CARTA"}
            </Text>
          )}

          <Text bold size={size}>
            {order.home_order?.when !== "immediate" ? order.home_order?.when : "APPENA POSSIBILE"}
          </Text>
        </>
      )}
    </>
  );
}
