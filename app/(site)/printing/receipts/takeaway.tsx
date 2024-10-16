import { Text } from "react-thermal-printer";

import { HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import Header from "../common/Header";

type Order = HomeOrder | PickupOrder;

interface TakeawayProps<T extends Order> {
  order?: T;
}

export default function Takeaway<T extends Order>({ order }: TakeawayProps<T>) {
  return (
    <>
      <Text align="center">Scala Belvedere 2b</Text>
      <Text align="center">Tel: 040 470 20 81</Text>
      <Text align="center">Cell: 338 127 86 51</Text>
      <Text align="center">P.iva 01152790323</Text>
      <Header />
    </>
  );
}
