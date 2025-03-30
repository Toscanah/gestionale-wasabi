import { Row, Text } from "react-thermal-printer";
import capitalizeFirstLetter from "../../functions/formatting-parsing/capitalizeFirstLetter";

interface TimeSectionProps {
  orderDate?: Date;
}

export default function TimeSection({ orderDate }: TimeSectionProps) {
  const date = orderDate ?? new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const formattedDate = date.toLocaleDateString("it-IT", options);

  return (
    <Row
      left={<Text>{capitalizeFirstLetter(formattedDate)}</Text>}
      right={<Text>{date.toLocaleTimeString("it-IT")}</Text>}
    />
  );
}
