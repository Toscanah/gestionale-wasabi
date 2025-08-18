import { Row, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../../lib/utils/global/string/capitalizeFirstLetter";
import { DATE_FORMAT_OPTIONS } from "../constants";

interface TimeSectionProps {
  orderDate?: Date;
}

export default function TimeSection({ orderDate }: TimeSectionProps) {
  const finalDate = orderDate ?? new Date();
  const formattedDate = finalDate.toLocaleDateString("it-IT", DATE_FORMAT_OPTIONS);

  return (
    <Row
      left={<Text>{capitalizeFirstLetter(formattedDate)}</Text>}
      right={<Text>{finalDate.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
