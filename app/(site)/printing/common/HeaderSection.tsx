import { Br, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import { GlobalSettings } from "../../types/Settings";
import { defaultSettings } from "../../hooks/useSettings";

export default function HeaderSection() {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const settings = JSON.parse(
    localStorage.getItem("settings") || JSON.stringify(defaultSettings)
  ) as GlobalSettings;

  return (
    <>
      {/* <Image src={logo.src} width={200} height={200} align="center" /> */}

      <Text size={bigSize} bold align="center">
        {settings.name.toLocaleUpperCase()}
      </Text>
      <Br />
      <Text size={smallSize} align="center">
        {(settings.address.cap + " " + settings.address.city).toLocaleUpperCase()}
      </Text>
      <Text size={smallSize} align="center">
        {(settings.address.street + " " + settings.address.civic).toLocaleUpperCase()}
      </Text>
      <Text size={smallSize} align="center">
        Tel: {settings.telNumber.toLocaleUpperCase()}
      </Text>
      <Text size={smallSize} align="center">
        Cell: {settings.cellNumber.toLocaleUpperCase()}
      </Text>
      <Text size={smallSize} align="center">
        P.iva {settings.pIva.toLocaleUpperCase()}
      </Text>
      <Br />

      {TimeSection()}
    </>
  );
}
