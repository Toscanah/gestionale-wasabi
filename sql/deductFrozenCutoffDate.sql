-- PARAM:
--   $1 :: TIMESTAMP  -- theorised cutoff (include orders >= this timestamp)

WITH prod_tot AS (
  SELECT
    pio.order_id,
    SUM(
      pio.quantity *
      CASE WHEN o.type = 'TABLE' THEN p.site_price ELSE p.home_price END
    )::numeric(12,2) AS product_total
  FROM public."ProductInOrder" pio
  JOIN public."Order"   o ON o.id = pio.order_id
  JOIN public."Product" p ON p.id = pio.product_id
  WHERE pio.status = 'IN_ORDER'
    AND o.created_at >= '2025-06-15'
  GROUP BY pio.order_id
),
pay_tot AS (
  SELECT
    pay.order_id,
    COALESCE(SUM(pay.amount), 0)::numeric(12,2) AS payment_total
  FROM public."Payment" pay
  GROUP BY pay.order_id
),
orders_in_scope AS (
  SELECT o.id, o.created_at, o.discount, o.type
  FROM public."Order" o
  WHERE o.created_at >= '2025-06-15'
    AND EXISTS (
      SELECT 1
      FROM public."ProductInOrder" p2
      WHERE p2.order_id = o.id AND p2.status = 'IN_ORDER'
    )
)
SELECT
  o.id AS order_id,
  o.created_at,
  o.type,
    o.discount AS discount,
  ROUND(COALESCE(pt.product_total, 0)::numeric, 3) AS product_total_before_discount,
  ROUND(
    (COALESCE(pt.product_total, 0) * (1 - COALESCE(o.discount, 0) / 100.0))::numeric,
    2
  ) AS theoretical_total_after_discount,
  ROUND(COALESCE(py.payment_total, 0)::numeric, 2) AS payment_total,
  (
    ROUND((COALESCE(pt.product_total, 0) * (1 - COALESCE(o.discount, 0) / 100.0))::numeric, 3)
    - ROUND(COALESCE(py.payment_total, 0)::numeric, 3)
  ) AS difference
--   ,COUNT(*) OVER () AS mismatch_count
FROM orders_in_scope o
LEFT JOIN prod_tot pt ON pt.order_id = o.id
LEFT JOIN pay_tot  py ON py.order_id = o.id
WHERE (
    ROUND((COALESCE(pt.product_total, 0) * (1 - COALESCE(o.discount, 0) / 100.0))::numeric, 3)
    - ROUND(COALESCE(py.payment_total, 0)::numeric, 3)
  ) > 0.0001
  AND (
    ROUND((COALESCE(pt.product_total, 0) * (1 - COALESCE(o.discount, 0) / 100.0))::numeric, 3)
    - ROUND(COALESCE(py.payment_total, 0)::numeric, 3)
  ) <= 5
ORDER BY o.created_at ASC;
