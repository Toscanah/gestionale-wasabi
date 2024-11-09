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
          <Text bold inline>
            Preferenze:{" "}
          </Text>
          <Text>{order.home_order.customer.preferences.toUpperCase()}</Text>
          <Br />
          <Line />
          <Br />
        </>
      )}

      <Text bold inline>
        Tel:{" "}
      </Text>
      <Text inline>{order.home_order?.customer.phone?.phone}</Text>
      <Br />

      <Text bold inline>
        Via:{" "}
      </Text>
      <Text inline>
        {(order.home_order?.address.street + " " + order.home_order?.address.civic).toUpperCase()}
      </Text>
      <Br />

      {order.home_order?.address.street_info && (
        <>
          <Text bold inline>
            Informazioni strad:{" "}
          </Text>
          <Text inline>{order.home_order.address.street_info.toUpperCase()}</Text>
          <Br />
        </>
      )}

      <Text bold inline>
        Campanello:{" "}
      </Text>
      <Text inline>{order.home_order?.address.doorbell.toUpperCase()}</Text>
      <Br />

      {order.home_order?.address.floor && (
        <>
          <Text bold inline>
            Piano:{" "}
          </Text>
          <Text inline>{order.home_order.address.floor}</Text>
          <Br />
        </>
      )}

      {order.home_order?.address.stair && (
        <>
          <Text bold inline>
            {order.home_order?.address.floor && ", "}Scala:{" "}
          </Text>
          <Text inline>{order.home_order.address.stair}</Text>
          <Br />
        </>
      )}

      {quickPaymentOption !== "none" && (
        <>
          <Text bold inline>
            Pagamento:{" "}
          </Text>
          <Text inline>{quickPaymentOption === "cash" ? "CONTANTI" : "CARTA"}</Text>
          <Br />
        </>
      )}

      <Text bold inline>
        Quando:{" "}
      </Text>
      <Text>
        {order.home_order?.when !== "immediate"
          ? `"${order.home_order?.when}"`
          : '"PRIMA POSSIBILE"'}
      </Text>

      <Br />
    </>
  );
}
