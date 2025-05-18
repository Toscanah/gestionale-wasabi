import { Engagement, EngagementType } from "@prisma/client";
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

interface EngagementSectionProps {
  activeEngagements: EngagementWithDetails[];
}

export default function EngagementSection({ activeEngagements }: EngagementSectionProps) {
  const smallSize = getReceiptSize(1, 1);
  const bigSize = getReceiptSize(2, 2);

  // Max character width per font size (based on font specs)
  const maxSmallChars = 48;
  const maxBigChars = 24;

  return (
    <>
      {activeEngagements.map((engagement, index) => {
        const payload = engagement.template.payload as CommonPayload;
        const messagePayload = engagement.template.payload as MessagePayload;

        return (
          <Fragment key={index}>
            {payload.textAbove &&
              wrapTextCentered(payload.textAbove, maxSmallChars).map((line, i) => (
                <Text key={`above-${i}`} align="left" size={smallSize} bold>
                  {line}
                </Text>
              ))}

            {payload.textAbove && <Br />}

            {engagement.template.type === EngagementType.MESSAGE ? (
              wrapTextCentered(messagePayload.message, maxBigChars).map((line, i) => (
                <Text key={`msg-${i}`} align="left" size={bigSize} bold>
                  {line}
                </Text>
              ))
            ) : engagement.template.type === EngagementType.QR_CODE ? (
              <QRCode
                align="center"
                content={(engagement.template.payload as QrPayload).url}
                cellSize={6}
              />
            ) : (
              <Image align="center" src={(engagement.template.payload as ImagePayload).imageUrl} />
            )}

            <Br />

            {payload.textBelow &&
              wrapTextCentered(payload.textBelow, maxSmallChars).map((line, i) => (
                <Text key={`below-${i}`} align="left" size={smallSize} bold>
                  {line}
                </Text>
              ))}

            {payload.textBelow && <Br />}
          </Fragment>
        );
      })}
    </>
  );
}
