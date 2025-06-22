import { EngagementType } from "@prisma/client";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import {
  CommonPayload,
  EngagementWithDetails,
  ImagePayload,
  MessagePayload,
  QrPayload,
} from "../../shared";
import { Br, Image, Line, QRCode, Text } from "react-thermal-printer";
import { Fragment } from "react";
import wrapTextCentered from "../../lib/formatting-parsing/printing/wrapTextCentered";
import sanitizeReceiptText from "../../lib/formatting-parsing/printing/sanitazeReceiptText";

interface EngagementSectionProps {
  activeEngagements: EngagementWithDetails[];
}

export default function EngagementSection({ activeEngagements }: EngagementSectionProps) {
  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  // Max character width per font size (based on font specs)
  const MAX_SMALL_CHARS = 48;
  const MAX_BIG_CHARS = 24;

  return (
    <>
      {activeEngagements.map((engagement, index) => {
        const payload = engagement.template.payload as CommonPayload;
        const messagePayload = engagement.template.payload as MessagePayload;

        return (
          <Fragment key={index}>
            <Br />

            {payload.textAbove &&
              wrapTextCentered(sanitizeReceiptText(payload.textAbove), MAX_SMALL_CHARS).map(
                (line, i) => (
                  <Text key={`above-${i}`} align="left" size={smallSize} bold>
                    {line}
                  </Text>
                )
              )}

            {payload.textAbove && <Br />}

            {engagement.template.type === EngagementType.MESSAGE ? (
              <>
                <Text key={`qr-${engagement.template.id}a`}>{"=".repeat(MAX_SMALL_CHARS)}</Text>

                {wrapTextCentered(sanitizeReceiptText(messagePayload.message), MAX_BIG_CHARS).map(
                  (line, i) => (
                    <Text key={`msg-${i}`} align="left" size={bigSize} bold>
                      {line}
                    </Text>
                  )
                )}

                <Text key={`qr-${engagement.template.id}b`}>{"=".repeat(MAX_SMALL_CHARS)}</Text>
              </>
            ) : engagement.template.type === EngagementType.QR_CODE ? (
              <>
                <QRCode
                  align="center"
                  content={(engagement.template.payload as QrPayload).url}
                  cellSize={6}
                />
              </>
            ) : (
              <Image align="center" src={(engagement.template.payload as ImagePayload).imageUrl} />
            )}

            <Br />

            {payload.textBelow &&
              wrapTextCentered(sanitizeReceiptText(payload.textBelow), MAX_SMALL_CHARS).map(
                (line, i) => (
                  <Text key={`below-${i}`} align="left" size={smallSize} bold>
                    {line}
                  </Text>
                )
              )}

            {payload.textBelow && <Br />}
          </Fragment>
        );
      })}
    </>
  );
}
