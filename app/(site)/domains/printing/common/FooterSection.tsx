import { Br, QRCode, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../../lib/formatting-parsing/capitalizeFirstLetter";

export default function FooterSection(orderId: number) {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("it-IT", options);

  return (
    <>
      <Text align="center">
        ({currentDate.toLocaleTimeString("it-IT")} - {capitalizeFirstLetter(formattedDate)}, n°{" "}
        {orderId})
      </Text>
      <Br />

      {/* <Text align="center">
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
      </Text> */}
    </>
  );
}
