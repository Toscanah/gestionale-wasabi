-- 1. Drop FKs in other tables that reference these PKs
ALTER TABLE public."MetaMessageLog"
DROP CONSTRAINT "MetaMessageLog_home_order_id_fkey";

-- Repeat for any other dependent table/FK if needed
-- e.g. ALTER TABLE SomeTable DROP CONSTRAINT SomeTable_pickup_order_id_fkey;
-- 2. Drop existing PKs on subtype tables
ALTER TABLE public."HomeOrder"
DROP CONSTRAINT "HomeOrder_pkey";

ALTER TABLE public."PickupOrder"
DROP CONSTRAINT "PickupOrder_pkey";

ALTER TABLE public."TableOrder"
DROP CONSTRAINT "TableOrder_pkey";

-- 3. Rename id to old_id temporarily
ALTER TABLE public."HomeOrder"
RENAME COLUMN id TO old_id;

ALTER TABLE public."PickupOrder"
RENAME COLUMN id TO old_id;

ALTER TABLE public."TableOrder"
RENAME COLUMN id TO old_id;

-- 4. Add new id column
ALTER TABLE public."HomeOrder"
ADD COLUMN id INT;

ALTER TABLE public."PickupOrder"
ADD COLUMN id INT;

ALTER TABLE public."TableOrder"
ADD COLUMN id INT;

-- 5. Copy order_id into new id
UPDATE public."HomeOrder"
SET
    id = order_id;

UPDATE public."PickupOrder"
SET
    id = order_id;

UPDATE public."TableOrder"
SET
    id = order_id;

-- 6. Set NOT NULL
ALTER TABLE public."HomeOrder"
ALTER COLUMN id
SET
    NOT NULL;

ALTER TABLE public."PickupOrder"
ALTER COLUMN id
SET
    NOT NULL;

ALTER TABLE public."TableOrder"
ALTER COLUMN id
SET
    NOT NULL;

-- 7. Add PKs
ALTER TABLE public."HomeOrder" ADD CONSTRAINT "HomeOrder_pkey" PRIMARY KEY (id);

ALTER TABLE public."PickupOrder" ADD CONSTRAINT "PickupOrder_pkey" PRIMARY KEY (id);

ALTER TABLE public."TableOrder" ADD CONSTRAINT "TableOrder_pkey" PRIMARY KEY (id);

-- 8. Add FKs to Order(id)
ALTER TABLE public."HomeOrder" ADD CONSTRAINT "HomeOrder_id_fkey" FOREIGN KEY (id) REFERENCES public."Order" (id) ON DELETE CASCADE;

ALTER TABLE public."PickupOrder" ADD CONSTRAINT "PickupOrder_id_fkey" FOREIGN KEY (id) REFERENCES public."Order" (id) ON DELETE CASCADE;

ALTER TABLE public."TableOrder" ADD CONSTRAINT "TableOrder_id_fkey" FOREIGN KEY (id) REFERENCES public."Order" (id) ON DELETE CASCADE;

-- 9. Drop old order_id column
ALTER TABLE public."HomeOrder"
DROP COLUMN order_id;

ALTER TABLE public."PickupOrder"
DROP COLUMN order_id;

ALTER TABLE public."TableOrder"
DROP COLUMN order_id;

-- 10. Drop old_id
ALTER TABLE public."HomeOrder"
DROP COLUMN old_id;

ALTER TABLE public."PickupOrder"
DROP COLUMN old_id;

ALTER TABLE public."TableOrder"
DROP COLUMN old_id;

-- 11. Recreate FKs in other tables
ALTER TABLE public."MetaMessageLog" ADD CONSTRAINT "MetaMessageLog_home_order_id_fkey" FOREIGN KEY (home_order_id) REFERENCES public."HomeOrder" (id) ON DELETE CASCADE;