import sanitizeReceiptText from "@/app/(site)/lib/utils/domains/printing/sanitazeReceiptText";
import {
  CommonPayload,
  EngagementWithDetails,
  ImagePayload,
  MessagePayload,
  QrPayload,
} from "@/app/(site)/lib/shared";
import { Fragment } from "react";
import { Br, Cut, Image, QRCode, Text } from "react-thermal-printer";
import { BIG_PRINT, SMALL_PRINT } from "../../../lib/shared/constants/printing";
import { EngagementType } from "@prisma/client";
import wrapTextCentered from "@/app/(site)/lib/utils/domains/printing/wrapTextCentered";

export interface EngagementPrintProps {
  engagement: EngagementWithDetails;
}

export default function SingleEngagement({ engagement }: EngagementPrintProps) {
  const MAX_SMALL_CHARS = 48;
  const MAX_BIG_CHARS = 24;

  if (!engagement.enabled) return null;

  const payload = engagement.template.payload as CommonPayload;
  const messagePayload = engagement.template.payload as MessagePayload;
  const type = engagement.template.type;
  const { textAbove, textBelow } = payload;

  return (
    <Fragment>
      <Br />

      {textAbove &&
        wrapTextCentered(sanitizeReceiptText(textAbove), MAX_SMALL_CHARS).map((line, i) => (
          <Text key={`above-${i}`} align="left" size={SMALL_PRINT} bold>
            {line}
          </Text>
        ))}

      {textBelow && <Br />}

      {type === EngagementType.MESSAGE ? (
        <>
          <Text key={`qr-${engagement.template.id}a`}>{"=".repeat(MAX_SMALL_CHARS)}</Text>

          {wrapTextCentered(sanitizeReceiptText(messagePayload.message), MAX_BIG_CHARS).map(
            (line, i) => (
              <Text key={`msg-${i}`} align="left" size={BIG_PRINT} bold>
                {line}
              </Text>
            )
          )}

          <Text key={`qr-${engagement.template.id}b`}>{"=".repeat(MAX_SMALL_CHARS)}</Text>
        </>
      ) : type === EngagementType.QR_CODE ? (
        <QRCode
          align="center"
          content={(engagement.template.payload as QrPayload).url}
          cellSize={6}
        />
      ) : (
        <Image align="center" src={(engagement.template.payload as ImagePayload).imageUrl} />
      )}

      <Br />

      {textBelow &&
        wrapTextCentered(sanitizeReceiptText(textBelow), MAX_SMALL_CHARS).map((line, i) => (
          <Text key={`below-${i}`} align="left" size={SMALL_PRINT} bold>
            {line}
          </Text>
        ))}

      {textBelow && <Br />}
    </Fragment>
  );
}
