import { Br, Text } from "react-thermal-printer";
import TimeSection from "./TimeSection";
import { GlobalSettings } from "@/lib/shared/types/settings/global";
import { DEFAULT_SETTINGS } from "@/lib/shared/constants/config/settings";
import sanitazeReceiptText from "../../../../../lib/shared/utils/domains/printing/sanitazeReceiptText";
import { BIG_PRINT, SMALL_PRINT } from "@/lib/shared";

// import logo from "../../../../public/logo.png";

interface HeaderSectionProps {
  orderDate: Date;
}

export default function HeaderSection({ orderDate }: HeaderSectionProps) {
  const settings = JSON.parse(
    localStorage.getItem("settings") || JSON.stringify(DEFAULT_SETTINGS)
  ) as GlobalSettings;

  const truncate = (text: string, maxChar: number) => text.slice(0, maxChar);

  return (
    <>
      {/* <Image src={logo.src} width={200} height={200} align="center" /> */}

      <Text size={BIG_PRINT} bold align="center">
        {truncate(sanitazeReceiptText(settings.profile.name), 20)}
      </Text>

      {settings.profile.slogan && (
        <Text size={SMALL_PRINT} align="center">
          {truncate(sanitazeReceiptText(settings.profile.slogan), 40)}
        </Text>
      )}

      <Br />

      <Text size={SMALL_PRINT} align="center">
        {truncate(sanitazeReceiptText(settings.profile.address.street + " " + settings.profile.address.civic), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {truncate(sanitazeReceiptText(settings.profile.address.cap + " " + settings.profile.address.city), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {truncate(sanitazeReceiptText(`Tel: ${settings.profile.telNumber}`), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {truncate(sanitazeReceiptText(`Cell: ${settings.profile.cellNumber}`), 40)}
      </Text>

      <Text size={SMALL_PRINT} align="center">
        {truncate(sanitazeReceiptText(`P.iva ${settings.profile.pIva}`), 40)}
      </Text>

      <Br />

      {TimeSection({ orderDate })}
    </>
  );
}
