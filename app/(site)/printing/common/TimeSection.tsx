import { Row, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../functions/formatting-parsing/capitalizeFirstLetter";

interface TimeSectionProps {
  orderDate: Date;
}

export default function TimeSection({ orderDate }: TimeSectionProps) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const formattedDate = orderDate.toLocaleDateString("it-IT", options);

  return (
    <Row
      left={<Text>{capitalizeFirstLetter(formattedDate)}</Text>}
      right={<Text>{orderDate.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
