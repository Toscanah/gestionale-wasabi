import { Text } from "react-thermal-printer";
import { HomeOrder, PickupOrder } from "../../types/PrismaOrders";

type Order = HomeOrder | PickupOrder;

interface OrderProps<T extends Order> {
  order: T;
}

const OrderInfo = <T extends Order>({ order }: OrderProps<T>) => {
  const isHomeOrder = "home_order" in order;
  const isPickupOrder = "pickup_order" in order;

  return (
    <>
      {isHomeOrder && (
        <>
          <Text>Ora di consegna: {order.home_order?.when}</Text>
          <Text>Numero telefono: {order.home_order?.customer.phone?.phone}</Text>
          <Text>
            N° {order.id} Indirizzo:{" "}
            {order.home_order?.address.street + " " + order.home_order?.address.civic}
          </Text>
          <Text>Note: {order.home_order?.notes}</Text>
          <Text>Campanello: {order.home_order?.address.doorbell}</Text>
          <Text>Piano: {order.home_order?.address.floor}</Text>
          <Text>Scala: {order.home_order?.address.stair}</Text>
        </>
      )}

      {isPickupOrder && (
        <>
          <Text>Ora di consegna: {order.pickup_order?.when}</Text>
          <Text>Numero telefono: {order.pickup_order?.customer?.phone?.phone}</Text>
        </>
      )}
    </>
  );
};

export default OrderInfo;
