BEGIN;

-- 1) Add order_notes column to Customer if it doesn't exist yet
ALTER TABLE public."Customer"
ADD COLUMN IF NOT EXISTS order_notes TEXT;

-- 2) Decision-making migration
WITH all_notes AS (
  SELECT ho.customer_id,
         btrim(ho.notes) AS note,
         o.created_at,
         'HOME'::text AS source
  FROM public."HomeOrder" ho
  JOIN public."Order" o ON o.id = ho.id
  WHERE ho.notes IS NOT NULL AND btrim(ho.notes) <> ''

  UNION ALL

  SELECT po.customer_id,
         btrim(po.notes) AS note,
         o.created_at,
         'PICKUP'::text AS source
  FROM public."PickupOrder" po
  JOIN public."Order" o ON o.id = po.id
  WHERE po.customer_id IS NOT NULL
    AND po.notes IS NOT NULL AND btrim(po.notes) <> ''
),
freq AS (
  SELECT
    customer_id,
    note,
    COUNT(*) AS total_cnt,
    COUNT(*) FILTER (WHERE source = 'HOME') AS home_cnt,
    MAX(created_at) AS last_used
  FROM all_notes
  GROUP BY customer_id, note
),
ranked AS (
  SELECT f.*,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY total_cnt DESC, home_cnt DESC, last_used DESC
         ) AS rk
  FROM freq f
),
best AS (
  SELECT customer_id, note
  FROM ranked
  WHERE rk = 1
)
UPDATE public."Customer" c
SET order_notes = b.note
FROM best b
WHERE c.id = b.customer_id;

-- 3) Drop old notes columns
ALTER TABLE public."HomeOrder" DROP COLUMN notes;
ALTER TABLE public."PickupOrder" DROP COLUMN notes;

COMMIT;
