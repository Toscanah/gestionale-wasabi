import { Br, Image, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import { GlobalSettings } from "../../types/Settings";
import { DEFAULT_SETTINGS } from "../../hooks/useSettings";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";

import logo from "../../../../public/logo.png";

export default function HeaderSection() {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const settings = JSON.parse(
    localStorage.getItem("settings") || JSON.stringify(DEFAULT_SETTINGS)
  ) as GlobalSettings;

  const truncate = (text: string, maxChar: number) => text.slice(0, maxChar);

  return (
    <>
      <Image src={logo.src} width={200} height={200} align="center" />

      <Text size={bigSize} bold align="center">
        {truncate(sanitazeReceiptText(settings.name), 20)}
      </Text>

      {settings.slogan && (
        <Text size={smallSize} align="center">
          {truncate(sanitazeReceiptText(settings.slogan), 40)}
        </Text>
      )}

      <Br />

      <Text size={smallSize} align="center">
        {truncate(sanitazeReceiptText(settings.address.street + " " + settings.address.civic), 40)}
      </Text>

      <Text size={smallSize} align="center">
        {truncate(sanitazeReceiptText(settings.address.cap + " " + settings.address.city), 40)}
      </Text>

      <Text size={smallSize} align="center">
        {truncate(sanitazeReceiptText(`Tel: ${settings.telNumber}`), 40)}
      </Text>

      <Text size={smallSize} align="center">
        {truncate(sanitazeReceiptText(`Cell: ${settings.cellNumber}`), 40)}
      </Text>

      <Text size={smallSize} align="center">
        {truncate(sanitazeReceiptText(`P.iva ${settings.pIva}`), 40)}
      </Text>

      <Br />

      {TimeSection()}
    </>
  );
}
