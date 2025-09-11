-- @param {DateTime} $1:from? Start date of the period (nullable)
-- @param {DateTime} $2:to? End date of the period (nullable)
-- @param {Json}     $3:weekdays? Allowed weekdays as JSON array (nullable)
-- @param {WorkingShift}   $4:shift? Working shift filter (nullable, 'ALL' means ignore)
-- @param {String}   $5:from_time? Start time of day "HH:mm" (nullable)
-- @param {String}   $6:to_time? End time of day "HH:mm" (nullable)

WITH
    days AS (
        SELECT generate_series(
            COALESCE($1::timestamptz, (SELECT MIN(created_at) FROM "Order")),
            COALESCE($2::timestamptz, NOW()),
            interval '1 day'
        )::date AS day
    ),

    valid_days AS (
        SELECT d.day
        FROM days d
        WHERE EXTRACT(DOW FROM d.day) <> 1 -- skip Mondays
          AND (
              $3::jsonb IS NULL
              OR EXTRACT(DOW FROM d.day)::int IN (
                  SELECT jsonb_array_elements_text($3::jsonb)::int
              )
          )
    ),

    num_days AS (
        SELECT GREATEST(COUNT(*), 1)::int AS cnt
        FROM valid_days
    ),

    filtered_orders AS (
        SELECT o.*
        FROM "Order" o
        WHERE o.status = 'PAID'
          AND ($1::timestamptz IS NULL OR o.created_at >= $1)
          AND ($2::timestamptz IS NULL OR o.created_at <= $2)
          AND EXTRACT(DOW FROM o.created_at) <> 1 -- skip Mondays
          AND (
              $3 IS NULL
              OR EXTRACT(DOW FROM o.created_at)::int IN (
                  SELECT jsonb_array_elements_text($3::jsonb)::int
              )
          )
          AND (
              $4::"WorkingShift" IS NULL OR o.shift = $4::"WorkingShift"
          )
          AND (
              $5::text IS NULL OR $6::text IS NULL
              OR to_char(o.created_at, 'HH24:MI') BETWEEN $5::text AND $6::text
          )
    ),

    product_lines AS (
        SELECT
            pio.order_id,
            SUM(pio.paid_quantity)::double precision                    AS total_products,
            SUM(pio.paid_quantity * pio.frozen_price)::double precision AS line_revenue,
            SUM(
                CASE 
                  WHEN pio.status IN ('IN_ORDER','DELETED_COOKED') 
                  THEN (pio.paid_quantity * pr.rice) 
                  ELSE 0 
                END
            )::double precision                                         AS rice_mass,
            SUM(pr.soups  * pio.quantity)::double precision             AS soups,
            SUM(pr.rices  * pio.quantity)::double precision             AS rices,
            SUM(pr.salads * pio.quantity)::double precision             AS salads
        FROM "ProductInOrder" pio
        JOIN "Product" pr ON pr.id = pio.product_id
        GROUP BY pio.order_id
    ),

    order_stats AS (
        SELECT
            fo.type,
            COUNT(DISTINCT fo.id)::int           AS orders,
            COALESCE(SUM(pl.line_revenue), 0)::double precision  AS revenue,
            COALESCE(SUM(pl.total_products),0)::double precision AS products,
            SUM(
              CASE 
                WHEN fo.soups IS NOT NULL AND fo.soups <> 0 THEN fo.soups
                ELSE pl.soups
              END
            )::double precision AS soups,
            SUM(
              CASE 
                WHEN fo.rices IS NOT NULL AND fo.rices <> 0 THEN fo.rices
                ELSE pl.rices
              END
            )::double precision AS rices,
            SUM(
              CASE 
                WHEN fo.salads IS NOT NULL AND fo.salads <> 0 THEN fo.salads
                ELSE pl.salads
              END
            )::double precision AS salads,
            SUM(pl.rice_mass)::double precision AS rice
        FROM filtered_orders fo
        LEFT JOIN product_lines pl ON pl.order_id = fo.id
        GROUP BY fo.type
    )

SELECT
    os.type,
    os.orders,
    os.revenue,
    os.products,
    os.soups,
    os.rices,
    os.salads,
    os.rice,
    (os.revenue / NULLIF(os.orders,0))::double precision AS "revenuePerOrder",
    (os.orders   / nd.cnt)::double precision             AS "ordersPerDay",
    (os.revenue  / nd.cnt)::double precision             AS "revenuePerDay",
    (os.products / nd.cnt)::double precision             AS "productsPerDay",
    (os.soups    / nd.cnt)::double precision             AS "soupsPerDay",
    (os.rices    / nd.cnt)::double precision             AS "ricesPerDay",
    (os.salads   / nd.cnt)::double precision             AS "saladsPerDay",
    (os.rice     / nd.cnt)::double precision             AS "ricePerDay"
FROM order_stats os
CROSS JOIN num_days nd;
