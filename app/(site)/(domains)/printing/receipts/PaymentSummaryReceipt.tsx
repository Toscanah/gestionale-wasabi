import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import sanitazeReceiptText from "../../../lib/utils/domains/printing/sanitazeReceiptText";
import { SMALL_PRINT } from "../constants";
import fitReceiptText from "@/app/(site)/lib/utils/domains/printing/fitReceiptText";
import { PaymentContracts } from "@/app/(site)/lib/shared";

export interface PaymentSummaryReceiptProps {
  summaryData: PaymentContracts.GetSummary.Output;
  period: string;
}

export default function PaymentSummaryReceipt({ summaryData, period }: PaymentSummaryReceiptProps) {
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
      <Row
        left={<Text size={SMALL_PRINT}>Periodo</Text>}
        right={<Text size={SMALL_PRINT}>{fitReceiptText(sanitazeReceiptText(period), 35)}</Text>}
      />

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
