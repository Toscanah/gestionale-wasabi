import { useState, useEffect } from "react";
import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { SummaryData } from "../../payments/table/PrintSummary";
import formatAmount from "../../functions/formatting-parsing/formatAmount";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";

interface PaymentSummaryReceiptProps {
  summaryData: SummaryData;
}

export default function PaymentSummaryReceipt({ summaryData }: PaymentSummaryReceiptProps) {
  const date = new Date();
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
              {formatAmount(data.total)} €
            </Text>
          }
        />
      ))}

      <Br />
      <Line />
      <Br />

      {/* <Row
        left={
          <Text bold size={smallSize}>
            TOTALE IN LOCO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {formatAmount(summaryData.inPlaceAmount)} €
          </Text>
        }
      /> */}
      {/* <Row
        left={
          <Text bold size={smallSize}>
            TOTALE DOMICILIO + ASPORTO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {formatAmount(summaryData.takeawayAmount)} €
          </Text>
        }
      /> */}
      <Row
        left={
          <Text bold size={smallSize}>
            TOTALE DOMICILIO
          </Text>
        }
        right={
          <Text bold size={smallSize}>
            {formatAmount(summaryData.homeOrdersAmount)} €
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
            {formatAmount(summaryData.pickupOrdersAmount)} €
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
            {formatAmount(summaryData.tableOrdersAmount)} €
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
            {formatAmount(summaryData.totalAmount)} €
          </Text>
        }
      />

      <Cut />
    </>
  );
}
