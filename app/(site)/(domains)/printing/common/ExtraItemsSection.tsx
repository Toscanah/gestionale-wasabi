import { Br, Text } from "react-thermal-printer";
import calculateExtraItems from "../../../lib/services/order-management/calculateExtraItems";
import { OrderByType } from "@/app/(site)/lib/shared";
import { SMALL_PRINT } from "../../../lib/shared/constants/printing";

interface ExtraItemsProps {
  order: OrderByType;
}

export default function ExtraItemsSection({ order }: ExtraItemsProps) {
  const { ricesFinal, soupsFinal, saladsFinal } = calculateExtraItems(order);

  const hasSoups = soupsFinal > 0;
  const hasSalads = saladsFinal > 0;
  const hasRices = ricesFinal > 0;

  return (
    <>
      {hasSoups && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Zuppe:{" "}
          </Text>
          <Text inline size={SMALL_PRINT}>
            {soupsFinal}
          </Text>
        </>
      )}

      {hasSoups && (hasSalads || hasRices) && (
        <Text inline size={SMALL_PRINT}>
          {" "}
        </Text>
      )}

      {hasSalads && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Insalate:{" "}
          </Text>
          <Text inline size={SMALL_PRINT}>
            {saladsFinal}
          </Text>
        </>
      )}

      {hasSalads && hasRices && (
        <Text inline size={SMALL_PRINT}>
          {" "}
        </Text>
      )}

      {hasRices && (
        <>
          <Text bold inline size={SMALL_PRINT}>
            Riso:{" "}
          </Text>
          <Text inline size={SMALL_PRINT}>
            {ricesFinal}
          </Text>
        </>
      )}

      {(hasSoups || hasSalads || hasRices) && <Br />}
    </>
  );
}
