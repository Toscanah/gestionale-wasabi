import {
  EngagementContracts,
  ImagePayload,
  MessagePayload,
  ParsedEngagementPayload,
  QrPayload,
} from "@/app/(site)/lib/shared";
import { EngagementType } from "@prisma/client";
import QRCode from "./QRCode";
import Image from "./Image";
import Message from "./Message";
import React from "react";

export default function renderByType(
  type: EngagementType,
  payload: ParsedEngagementPayload,
  onChange: (update: any) => void,
  disabled = false
): React.JSX.Element | null {
  switch (type) {
    case EngagementType.QR_CODE:
      return (
        <>
          <QRCode
            value={(payload as QrPayload).url}
            onChange={(url) => !disabled && onChange({ url } as ParsedEngagementPayload)}
            disabled={disabled}
          />
        </>
      );
    case EngagementType.IMAGE:
      return (
        <Image
          value={(payload as ImagePayload).imageUrl}
          onChange={(selectedImage) =>
            !disabled && onChange({ selectedImage } as EngagementContracts.TemplatePayloadDraft)
          }
          disabled={disabled}
        />
      );
    case EngagementType.MESSAGE:
      return (
        <Message
          value={(payload as MessagePayload).message}
          onChange={(message) => !disabled && onChange({ message } as ParsedEngagementPayload)}
          disabled={disabled}
        />
      );
  }
}
