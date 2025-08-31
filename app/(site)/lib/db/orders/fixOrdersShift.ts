import { PrismaClient, WorkingShift } from "@prisma/client";
import { ShiftBoundaries } from "../../shared/enums/shift";

const prisma = new PrismaClient();

const timeToDecimal = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const inferShiftFromWhen = (when: string | null | undefined): WorkingShift => {
  if (!when || when.toLowerCase() === "immediate") return WorkingShift.UNSPECIFIED;

  try {
    const time = timeToDecimal(when);
    if (time >= ShiftBoundaries.LUNCH_FROM && time <= ShiftBoundaries.LUNCH_TO) return WorkingShift.LUNCH;
    if (time > ShiftBoundaries.LUNCH_TO && time <= ShiftBoundaries.DINNER_TO) return WorkingShift.DINNER;
    return WorkingShift.UNSPECIFIED;
  } catch {
    return WorkingShift.UNSPECIFIED;
  }
};

export async function fixOrdersShift() {
  const orders = await prisma.order.findMany({
    where: {
      shift: WorkingShift.UNSPECIFIED,
      OR: [{ home_order: { isNot: null } }, { pickup_order: { isNot: null } }],
    },
    include: {
      home_order: true,
      pickup_order: true,
    },
  });

  console.log(`Found ${orders.length} orders to process.`);

  for (const order of orders) {
    const when = order.home_order?.when ?? order.pickup_order?.when ?? null;

    const shift = inferShiftFromWhen(when);

    await prisma.order.update({
      where: { id: order.id },
      data: { shift },
    });

    console.log(`Order #${order.id} → when: ${when} → shift: ${shift}`);
  }

  console.log("✔️ All applicable orders have been updated.");
  return true;
}
