import { PrismaClient, WorkingShift } from "@prisma/client";

const prisma = new PrismaClient();

const LUNCH_START = 10.0; // 10:00
const LUNCH_END = 14.5; // 14:30
const DINNER_START = 14.5; // 14:30
const DINNER_END = 22.5; // 22:30

const timeToDecimal = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const inferShiftFromWhen = (when: string | null | undefined): WorkingShift => {
  if (!when || when.toLowerCase() === "immediate") return WorkingShift.UNSPECIFIED;

  try {
    const time = timeToDecimal(when);
    if (time >= LUNCH_START && time <= LUNCH_END) return WorkingShift.LUNCH;
    if (time > LUNCH_END && time <= DINNER_END) return WorkingShift.DINNER;
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
