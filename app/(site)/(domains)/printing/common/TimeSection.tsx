import { Row, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../../../../lib/shared/utils/global/string/capitalizeFirstLetter";
import { PRINTING_DATE_FORMAT } from "@/lib/shared/constants/printing";

interface TimeSectionProps {
  orderDate?: Date;
}

export default function TimeSection({ orderDate }: TimeSectionProps) {
  const finalDate = orderDate ?? new Date();
  const formattedDate = finalDate.toLocaleDateString("it-IT", PRINTING_DATE_FORMAT);

  return (
    <Row
      left={<Text>{capitalizeFirstLetter(formattedDate)}</Text>}
      right={<Text>{finalDate.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
