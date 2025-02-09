import { Br, Text } from "react-thermal-printer";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import calculateExtraItems from "../../functions/order-management/calculateExtraItems";
import { AnyOrder } from "../../models";

interface ExtraItemsProps {
  order: AnyOrder;
  putExtraItems?: boolean;
}

export default function ExtraItems({ order, putExtraItems = true }: ExtraItemsProps) {
  const smallSize = getReceiptSize(1, 1);

  const { ricesFinal, soupsFinal, saladsFinal } = calculateExtraItems(order);

  const hasSoups = soupsFinal > 0;
  const hasSalads = saladsFinal > 0;
  const hasRices = ricesFinal > 0;

  return (
    <>
      {putExtraItems && (hasSoups || hasSalads || hasRices) && (
        <>
          {hasSoups && (
            <>
              <Text bold inline size={smallSize}>
                Zuppe:{" "}
              </Text>
              <Text inline size={smallSize}>
                {soupsFinal}
              </Text>
            </>
          )}

          {hasSoups && (hasSalads || hasRices) && (
            <Text inline size={smallSize}>
              {", "}
            </Text>
          )}

          {hasSalads && (
            <>
              <Text bold inline size={smallSize}>
                Insalate:{" "}
              </Text>
              <Text inline size={smallSize}>
                {saladsFinal}
              </Text>
            </>
          )}

          {hasSalads && hasRices && (
            <Text inline size={smallSize}>
              {", "}
            </Text>
          )}

          {hasRices && (
            <>
              <Text bold inline size={smallSize}>
                Riso:{" "}
              </Text>
              <Text inline size={smallSize}>
                {ricesFinal}
              </Text>
            </>
          )}
        </>
      )}

      {putExtraItems && (hasSoups || hasSalads || hasRices) && <Br />}
    </>
  );
}
