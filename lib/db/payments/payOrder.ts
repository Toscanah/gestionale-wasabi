import {
  EngagementLedgerStatus,
  OrderStatus,
  PaymentScope,
  ProductInOrderStatus,
  PaymentType,
} from "@/prisma/generated/client/enums";
import roundToTwo from "@/lib/shared/utils/global/number/roundToTwo";
import prisma from "../prisma";
import { randomUUID } from "crypto";
import { PaymentContracts } from "@/lib/shared";
import { getOrderById } from "../orders/getOrderById";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";
import { Prisma } from "@/prisma/generated/client/client";

/**
 * Pay an order, handling:
 * - Normal payments
 * - Roman / Divide flows
 * - Zero-total (fully discounted) orders
 */
export default async function payOrder({
  payments,
  productsToPay,
}: PaymentContracts.PayOrder.Input): Promise<PaymentContracts.PayOrder.Output> {
  const filteredProducts = productsToPay.filter((ptp) => ptp.id !== -1);

  const orderId = payments[0]?.order_id ?? filteredProducts[0]?.order_id;
  if (!orderId) throw new Error("Missing orderId in payOrder input");

  const order = await getOrderById({ orderId });
  const orderTotal = getOrderTotal({ order, applyDiscounts: true });
  const rawOrderTotal = getOrderTotal({ order, applyDiscounts: false });

  if (orderTotal === 0) {
    if (rawOrderTotal === 0) {
      throw new Error("Cannot pay order with zero raw total");
    }
    return await handleZeroTotalOrder({ orderId });
  }

  if (payments.length === 0) {
    throw new Error("No payments passed");
  }

  const containsRoman = payments.some((p) => p.scope === PaymentScope.ROMAN);
  const paymentGroupCode = containsRoman ? randomUUID() : null;

  await prisma.$transaction(async (tx) => {
    await tx.payment.createMany({
      data: payments.map((payment) => ({
        amount: Number(roundToTwo(payment.amount)),
        type: payment.type,
        order_id: payment.order_id,
        scope: payment.scope,
        ...(paymentGroupCode ? { payment_group_code: paymentGroupCode } : {}),
      })),
    });

    await Promise.all(
      filteredProducts.map((productToPay) =>
        tx.productInOrder.update({
          where: { id: productToPay.id },
          data: {
            paid_quantity: { increment: productToPay.quantity },
          },
        })
      )
    );

    const allProducts = await tx.productInOrder.findMany({
      where: {
        order_id: orderId,
        status: ProductInOrderStatus.IN_ORDER,
      },
      select: { quantity: true, paid_quantity: true },
    });

    const allPaid = allProducts.every((p) => (p.paid_quantity ?? 0) >= p.quantity);

    if (allPaid) {
      await markOrderAsPaid({ tx, orderId });
    }

    await tx.order.update({
      where: { id: orderId },
      data: { is_receipt_printed: false },
    });
  });

  return await getOrderById({ orderId });
}

async function handleZeroTotalOrder({ orderId }: { orderId: number }) {
  return await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        amount: 0,
        type: "PROMOTION" as PaymentType,
        order_id: orderId,
        scope: PaymentScope.FULL,
      },
    });

    const products = await tx.productInOrder.findMany({
      where: { order_id: orderId },
      select: { id: true, quantity: true },
    });

    await Promise.all(
      products.map((p) =>
        tx.productInOrder.update({
          where: { id: p.id },
          data: { paid_quantity: p.quantity },
        })
      )
    );

    await markOrderAsPaid({ tx, orderId });

    return await getOrderById({ orderId });
  });
}

async function markOrderAsPaid({ tx, orderId }: { tx: Prisma.TransactionClient; orderId: number }) {
  await tx.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.PAID, is_receipt_printed: false },
  });

  const engagements = await tx.engagement.findMany({
    where: { order_id: orderId },
    select: { ledgers: true, id: true },
  });

  const reEnableIds = engagements
    .filter((e) => e.ledgers.every((l) => l.status !== EngagementLedgerStatus.ISSUED))
    .map((e) => e.id);

  if (reEnableIds.length > 0) {
    await tx.engagement.updateMany({
      where: { id: { in: reEnableIds } },
      data: { enabled: true },
    });
  }
}
