import { PrismaClient, Shift } from "@prisma/client";

const prisma = new PrismaClient();

const LUNCH_START = 12; 
const LUNCH_END = 14.5; 
const DINNER_START = 18.5; 
const DINNER_END = 22.5; 

const timeToDecimal = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const inferShiftFromWhen = (when: string | null | undefined): Shift => {
  if (!when || when.toLowerCase() === "immediate") return Shift.UNSPECIFIED;

  try {
    const time = timeToDecimal(when);
    if (time >= LUNCH_START && time < LUNCH_END) return Shift.LUNCH;
    if (time >= DINNER_START && time < DINNER_END) return Shift.DINNER;
    return Shift.UNSPECIFIED;
  } catch {
    return Shift.UNSPECIFIED;
  }
};

export async function fixOrdersShift() {
  const orders = await prisma.order.findMany({
    where: {
      shift: Shift.UNSPECIFIED,
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
}
