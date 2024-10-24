import { Br, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import { Notes } from "../../orders/single-order/overview/QuickNotes";

export default function orderInfo<T extends AnyOrder>(order: T, payment?: Notes) {
  const isHomeOrder = "home_order" in order;
  const isPickupOrder = "pickup_order" in order;
  console.log(order);

  return (
    <>
      {isHomeOrder && (
        <>
          <Text bold size={{ width: 2, height: 2 }}>
            {order.home_order?.customer.phone?.phone}
          </Text>

          <Text bold size={{ width: 2, height: 2 }}>
            {(
              order.home_order?.address.street +
              " " +
              order.home_order?.address.civic
            ).toUpperCase()}
          </Text>

          {order.home_order?.address.street_info && (
            <Text bold size={{ width: 2, height: 2 }}>
              {order.home_order?.address.street_info.toUpperCase()}
            </Text>
          )}

          <Text bold size={{ width: 2, height: 2 }}>
            {order.home_order?.address.doorbell.toUpperCase()}
          </Text>

          {(order.home_order?.address.floor || order.home_order?.address.stair) && (
            <Text bold size={{ width: 2, height: 2 }}>
              {order.home_order?.address.floor ? `${order.home_order.address.floor} piano` : ""}
              {order.home_order?.address.floor && order.home_order?.address.stair ? ", " : ""}
              {order.home_order?.address.stair ? `scala ${order.home_order.address.stair}` : ""}
            </Text>
          )}

          {payment && (
            <Text bold size={{ width: 2, height: 2 }}>
              {payment == "cash" ? "Contanti" : "Carta"}
            </Text>
          )}

          <Text bold size={{ width: 2, height: 2 }}>
            {order.home_order?.when !== "immediate" ? order.home_order?.when : "Appena possibile"}
          </Text>

          {/* {order.home_order?.notes && (
            <Text bold size={{ width: 2, height: 2 }}>
              {order.home_order?.notes}
            </Text>
          )} */}

        </>
      )}

      {/* {isPickupOrder && (
        <>
          <Text>Ora di consegna: {order.pickup_order?.when}</Text>
          <Text>Numero telefono: {order.pickup_order?.customer?.phone?.phone}</Text>
        </>
      )} */}
    </>
  );
}
