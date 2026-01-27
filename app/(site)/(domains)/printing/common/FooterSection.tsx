import { Br, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../../../../lib/shared/utils/global/string/capitalizeFirstLetter";
import { PRINTING_DATE_FORMAT } from "@/lib/shared/constants/printing";

interface FooterSection {
  orderId: number;
}

export default function FooterSection({ orderId }: FooterSection) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("it-IT", PRINTING_DATE_FORMAT);

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
