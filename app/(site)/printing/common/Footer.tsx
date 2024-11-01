import { Br, Line, QRCode, Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";

export default function footer(orderId: number) {
  return (
    <>
      <Text align="center">
        ({new Date().toLocaleTimeString("it-IT")} - {new Date().toLocaleDateString("it-IT")}, n°{" "}
        {orderId})
      </Text>
      <Br/>

      <Text align="center">
        Se sei soddisfatto del nostro servizio per favore dacci un giudizio
      </Text>

      <Br />
      <QRCode
        content="https://github.com/seokju-na/react-thermal-printer"
        align="center"
        cellSize={5}
      />
      <Br />

      <Text bold align="center">
        Arrivederci e a presto da Wasabi Sushi!
      </Text>
    </>
  );
}
