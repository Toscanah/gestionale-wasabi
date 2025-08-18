import { Br, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import { GlobalSettings } from "../../../lib/shared/types/Settings";
import { DEFAULT_SETTINGS } from "../../../hooks/useSettings";
import sanitazeReceiptText from "../../../lib/utils/domains/printing/sanitazeReceiptText";
import { BIG_PRINT, SMALL_PRINT } from "../constants";
import fitReceiptText from "@/app/(site)/lib/utils/domains/printing/fitReceiptText";

// import logo from "../../../../public/logo.png";

interface HeaderSectionProps {
  orderDate: Date;
}

export default function HeaderSection({ orderDate }: HeaderSectionProps) {
  const settings = JSON.parse(
    localStorage.getItem("settings") || JSON.stringify(DEFAULT_SETTINGS)
  ) as GlobalSettings;

  return (
    <>
      {/* <Image src={logo.src} width={200} height={200} align="center" /> */}

      <Text size={BIG_PRINT} bold align="center">
        {fitReceiptText(sanitazeReceiptText(settings.name), 20)}
      </Text>

      {settings.slogan && (
        <Text size={SMALL_PRINT} align="center">
          {fitReceiptText(sanitazeReceiptText(settings.slogan), 40)}
        </Text>
      )}

      <Br />

      <Text size={SMALL_PRINT} align="center">
        {fitReceiptText(
          sanitazeReceiptText(settings.address.street + " " + settings.address.civic),
          40
        )}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {fitReceiptText(
          sanitazeReceiptText(settings.address.cap + " " + settings.address.city),
          40
        )}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {fitReceiptText(sanitazeReceiptText(`Tel: ${settings.telNumber}`), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {fitReceiptText(sanitazeReceiptText(`Cell: ${settings.cellNumber}`), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {fitReceiptText(sanitazeReceiptText(`P.iva ${settings.pIva}`), 40)}
      </Text>

      <Br />

      {TimeSection({ orderDate })}
    </>
  );
}
