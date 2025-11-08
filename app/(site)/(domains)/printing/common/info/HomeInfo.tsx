import { Br, Line, Text } from "react-thermal-printer";
import { BIG_PRINT, SMALL_PRINT } from "../../../../lib/shared/constants/printing";
import sanitazeReceiptText from "@/app/(site)/lib/utils/domains/printing/sanitazeReceiptText";
import splitIntoLines from "@/app/(site)/lib/utils/global/string/splitIntoLines";
import { AddressType } from "@/prisma/generated/schemas";

interface HomeInfoProps {
  address: AddressType;
  phone: string | undefined;
  contactPhone: string | undefined;
  putWhen: boolean;
  whenValue: string | undefined;
}

export default function HomeInfo({
  address,
  phone,
  contactPhone,
  putWhen,
  whenValue,
}: HomeInfoProps) {
  const { doorbell, street, civic, street_info, floor, stair } = address;
  const splittedDoorbell = splitIntoLines(
    sanitazeReceiptText(doorbell ?? "").split(/\s+/),
    24,
    " "
  );
  return (
    <>
      {splittedDoorbell.map((line, idx) => (
        <Text size={BIG_PRINT} key={idx}>
          {line}
        </Text>
      ))}

      <Line />
      <Text bold inline size={SMALL_PRINT}>
        Via:{" "}
      </Text>
      <Text inline size={SMALL_PRINT}>
        {sanitazeReceiptText(`${street} ${civic}`).toUpperCase()}
      </Text>
      <Br />

      {street_info && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Informazioni strad:{" "}
          </Text>
          <Text inline size={SMALL_PRINT}>
            {sanitazeReceiptText(street_info)}
          </Text>
          <Br />
        </>
      )}

      {(floor || stair) && (
        <>
          {floor && (
            <>
              <Text bold inline size={SMALL_PRINT}>
                Piano:{" "}
              </Text>
              <Text inline={!!stair} size={SMALL_PRINT}>
                {sanitazeReceiptText(floor)}
              </Text>
              {stair && (
                <Text inline size={SMALL_PRINT}>
                  ,{" "}
                </Text>
              )}
            </>
          )}

          {stair && (
            <>
              <Text bold inline size={SMALL_PRINT}>
                Scala:{" "}
              </Text>
              <Text size={SMALL_PRINT}>{sanitazeReceiptText(stair)}</Text>
            </>
          )}
        </>
      )}

      <Text bold inline size={SMALL_PRINT}>
        Telefono:{" "}
      </Text>
      <Text size={SMALL_PRINT}>
        {phone}
        {contactPhone && ` oppure ${contactPhone}`}
      </Text>

      {putWhen && (
        <>
          <Line />
          <Text size={BIG_PRINT}>{whenValue !== "immediate" ? whenValue : "PRIMA POSSIBILE"}</Text>
        </>
      )}
    </>
  );
}
