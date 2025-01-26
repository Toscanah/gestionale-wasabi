import { Br, Image, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import { GlobalSettings } from "../../types/GlobalSettings";
import logo from "../../../../public/logo.png";

export default function HeaderSection() {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const settings = localStorage.getItem("settings");
  let iva: string | undefined = undefined;

  if (settings) {
    const parsedSettings: GlobalSettings = JSON.parse(settings);
    iva = parsedSettings.iva;
  }

  return (
    <>
      {/* <Image src={logo.src} width={200} height={200} align="center" /> */}

      <Text size={bigSize} bold align="center">
        WASABI SUSHI
      </Text>
      <Br />
      <Text size={smallSize} align="center">
        34135 TRIESTE
      </Text>
      <Text size={smallSize} align="center">
        SCALA AL BELVEDERE 2/B
      </Text>
      <Text size={smallSize} align="center">
        Tel: 040 4702081
      </Text>
      <Text size={smallSize} align="center">
        Cell: 338 1278651
      </Text>
      <Text size={smallSize} align="center">
        P.iva {iva}
      </Text>
      <Br />

      {TimeSection()}
    </>
  );
}
