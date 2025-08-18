import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import sanitazeReceiptText from "../../../lib/utils/domains/printing/sanitazeReceiptText";
import { PaymentsSummaryData } from "../../../hooks/usePaymentsHistory";
import { SMALL_PRINT } from "../constants";

export interface PaymentSummaryReceiptProps {
  summaryData: PaymentsSummaryData;
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

  const {
    totals,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
    homeOrdersCount,
    pickupOrdersCount,
    tableOrdersCount,
    customersCount,
    totalAmount,
    rawTotalAmount,
    centsDifference,
  } = summaryData;

  return (
    <>
      <Text inline>Recapito del giorno</Text>
      <Text bold> {formattedDate}</Text>

      <Br />
      <Line />
      <Br />

      {Object.entries(totals).map(([label, data]) => (
        <Row
          key={label}
          left={
            <Text bold size={SMALL_PRINT}>
              {data.label.toLocaleUpperCase()}
            </Text>
          }
          right={
            <Text bold size={SMALL_PRINT}>
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
          <Text bold size={SMALL_PRINT}>
            TOTALE DOMICILIO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(homeOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            TOTALE ASPORTO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(pickupOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            TOTALE TAVOLI
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(tableOrdersAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            CONTEGGIO DOMICILIO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {homeOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            CONTEGGIO ASPORTO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {pickupOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            CONTEGGIO TAVOLO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {tableOrdersCount.toString()}
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            CLIENTI TOTALI
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {customersCount.toString()}
          </Text>
        }
      />

      <Br />
      <Line />
      <Br />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            TOTALE CON SCONTI
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(totalAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            TOTALE LORDO
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(rawTotalAmount)} €
          </Text>
        }
      />

      <Row
        left={
          <Text bold size={SMALL_PRINT}>
            CENTESIMI ARROTONDATI
          </Text>
        }
        right={
          <Text bold size={SMALL_PRINT}>
            {roundToTwo(centsDifference)} €
          </Text>
        }
      />

      <Cut />
    </>
  );
}
