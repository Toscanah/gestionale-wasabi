-- 1. Create new enums
CREATE TYPE "OrderStatus" AS ENUM ('ACTIVE', 'PAID', 'CANCELLED');
CREATE TYPE "ProductInOrderStatus" AS ENUM ('IN_ORDER', 'DELETED_COOKED', 'DELETED_UNCOOKED');
CREATE TYPE "PlannedPayment" AS ENUM ('CASH', 'CARD', 'UNKNOWN');

-- 2. Add new columns as NULLable so we can migrate safely
ALTER TABLE public."Order"
    ADD COLUMN status "OrderStatus";

ALTER TABLE public."ProductInOrder"
    ADD COLUMN status "ProductInOrderStatus",
    ADD COLUMN variation TEXT;

ALTER TABLE public."HomeOrder"
    ADD COLUMN planned_payment "PlannedPayment",
    ADD COLUMN prepaid BOOLEAN;

ALTER TABLE public."PickupOrder"
    ADD COLUMN planned_payment "PlannedPayment",
    ADD COLUMN prepaid BOOLEAN;

-- 3. Copy values from old state columns
UPDATE public."Order"
SET status = state::text::"OrderStatus";

UPDATE public."ProductInOrder"
SET status = state::text::"ProductInOrderStatus",
    variation = additional_note;

-- 4. Map HomeOrder.payment → planned_payment
UPDATE public."HomeOrder"
SET planned_payment = CASE
    WHEN payment::text = 'ALREADY_PAID' THEN 'UNKNOWN'::"PlannedPayment"
    ELSE payment::text::"PlannedPayment"
END;

-- 5. Set prepaid = TRUE in HomeOrder if it was ALREADY_PAID
UPDATE public."HomeOrder"
SET prepaid = TRUE
WHERE payment::text = 'ALREADY_PAID';

-- 6. PickupOrder gets defaults for planned_payment & prepaid
UPDATE public."PickupOrder"
SET planned_payment = 'UNKNOWN'::"PlannedPayment",
    prepaid = FALSE;

-- 7. Set any NULL prepaid values to FALSE in HomeOrder
UPDATE public."HomeOrder"
SET prepaid = FALSE
WHERE prepaid IS NULL;

-- 8. Set defaults + NOT NULL constraints
ALTER TABLE public."Order"
    ALTER COLUMN status SET DEFAULT 'ACTIVE',
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE public."ProductInOrder"
    ALTER COLUMN status SET DEFAULT 'IN_ORDER',
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE public."HomeOrder"
    ALTER COLUMN planned_payment SET DEFAULT 'UNKNOWN',
    ALTER COLUMN planned_payment SET NOT NULL,
    ALTER COLUMN prepaid SET DEFAULT FALSE,
    ALTER COLUMN prepaid SET NOT NULL;

ALTER TABLE public."PickupOrder"
    ALTER COLUMN planned_payment SET DEFAULT 'UNKNOWN',
    ALTER COLUMN planned_payment SET NOT NULL,
    ALTER COLUMN prepaid SET DEFAULT FALSE,
    ALTER COLUMN prepaid SET NOT NULL;

-- 9. Drop old columns
ALTER TABLE public."Order" DROP COLUMN state;
ALTER TABLE public."ProductInOrder" DROP COLUMN state;
ALTER TABLE public."ProductInOrder" DROP COLUMN additional_note;
ALTER TABLE public."HomeOrder" DROP COLUMN payment;

-- 10. Drop old enum types
DROP TYPE "OrderState";
DROP TYPE "ProductInOrderState";
DROP TYPE "QuickPaymentOption";
