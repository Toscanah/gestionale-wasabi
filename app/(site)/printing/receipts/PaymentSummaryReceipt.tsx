import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { SummaryData } from "../../payments/history/PrintSummary";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";

interface PaymentSummaryReceiptProps {
  summaryData: SummaryData;
  date: Date;
}

export default function PaymentSummaryReceipt({ summaryData, date }: PaymentSummaryReceiptProps) {
  const formattedDate = sanitazeReceiptText(
    new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date)
  );

  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      <Text inline>Recapito del giorno</Text>
      <Text bold> {formattedDate}</Text>

      <Br />
      <Line />
      <Br />

      {Object.entries(summaryData.totals).map(([label, data]) => (
        <Row
          key={label}
          left={
            <Text bold size={smallSize}>
              {data.label.toLocaleUpperCase()}
            </Text>
          }
          right={
            <Text bold size={smallSize}>
              {roundToTwo(data.total)} €
            </Text>
          }
        />
      ))}

      <Br />
      <Line />
      <Br />

      <Row
        left={
          <Text bold size={smallSize}>
            TOTALE DOMICILIO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {roundToTwo(summaryData.homeOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            TOTALE ASPORTO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {roundToTwo(summaryData.pickupOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            TOTALE TAVOLI
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {roundToTwo(summaryData.tableOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            CONTEGGIO DOMICILIO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.homeOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            CONTEGGIO ASPORTO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.pickupOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            CONTEGGIO TAVOLO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.tableOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={smallSize}>
            CLIENTI TOTALI
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {summaryData.customersCount.toString()}
          </Text>
        }
      />

      <Br />
      <Line />
      <Br />

      <Row
        left={
          <Text bold size={bigSize}>
            TOTALE
          </Text>
        }
        right={
          <Text bold size={bigSize}>
            {roundToTwo(summaryData.totalAmount)} €
          </Text>
        }
      />

      <Cut />
    </>
  );
}
