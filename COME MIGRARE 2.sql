-- 1. Create new enums
CREATE TYPE "OrderStatus" AS ENUM ('ACTIVE', 'PAID', 'CANCELLED');
CREATE TYPE "ProductInOrderStatus" AS ENUM ('IN_ORDER', 'DELETED_COOKED', 'DELETED_UNCOOKED');
CREATE TYPE "PlannedPayment" AS ENUM ('CASH', 'CARD', 'UNKNOWN');

-- 2. Add new columns as NULLable so we can migrate safely
ALTER TABLE public."Order"
    ADD COLUMN status "OrderStatus",
    ADD COLUMN prepaid BOOLEAN;

ALTER TABLE public."ProductInOrder"
    ADD COLUMN status "ProductInOrderStatus",
    ADD COLUMN variation TEXT;

ALTER TABLE public."HomeOrder"
    ADD COLUMN planned_payment "PlannedPayment";

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

-- 5. Map prepaid in Order from HomeOrder.payment
UPDATE public."Order" o
SET prepaid = TRUE
FROM public."HomeOrder" h
WHERE h.id = o.id
  AND h.payment::text = 'ALREADY_PAID';

-- 6. Set any NULL prepaid values to FALSE
UPDATE public."Order"
SET prepaid = FALSE
WHERE prepaid IS NULL;

-- 7. Set defaults + NOT NULL constraints
ALTER TABLE public."Order"
    ALTER COLUMN status SET DEFAULT 'ACTIVE',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN prepaid SET DEFAULT FALSE,
    ALTER COLUMN prepaid SET NOT NULL;

ALTER TABLE public."ProductInOrder"
    ALTER COLUMN status SET DEFAULT 'IN_ORDER',
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE public."HomeOrder"
    ALTER COLUMN planned_payment SET DEFAULT 'UNKNOWN',
    ALTER COLUMN planned_payment SET NOT NULL;

-- 8. Drop old columns
ALTER TABLE public."Order" DROP COLUMN state;
ALTER TABLE public."ProductInOrder" DROP COLUMN state;
ALTER TABLE public."ProductInOrder" DROP COLUMN additional_note;
ALTER TABLE public."HomeOrder" DROP COLUMN payment;

-- 9. Drop old enum types
DROP TYPE "OrderState";
DROP TYPE "ProductInOrderState";
DROP TYPE "QuickPaymentOption";

-- 10. Recreate index on Order (now with status)
-- CREATE INDEX "Order_created_at_type_status_idx" 
-- ON public."Order" (created_at, type, status);

-- Optional verification queries
-- SELECT id, status, prepaid FROM public."Order" LIMIT 5;
-- SELECT id, status, variation FROM public."ProductInOrder" LIMIT 5;
-- SELECT id, planned_payment FROM public."HomeOrder" LIMIT 5;
