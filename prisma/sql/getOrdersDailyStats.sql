-- @param {DateTime}     $1:from? Start date of the period (nullable)
-- @param {DateTime}     $2:to? End date of the period (nullable)
-- @param {String}       $3:weekdays? Allowed weekdays as comma-separated string (nullable, e.g. '2,5')
-- @param {WorkingShift} $4:shift? Working shift filter (nullable, 'ALL' means ignore)
-- @param {String}       $5:from_time? Start time of day "HH:mm" (nullable)
-- @param {String}       $6:to_time? End time of day "HH:mm" (nullable)
-- @param {String}       $7:order_types? Allowed order types as comma-separated string (nullable, e.g. 'HOME,PICKUP')

WITH
    -- ✅ Generate all calendar days in the selected range
    days AS (
        SELECT generate_series(
            COALESCE($1::timestamptz, (SELECT MIN(created_at) FROM "Order")),
            COALESCE($2::timestamptz, NOW()),
            interval '1 day'
        )::date AS day
    ),

    -- ✅ Filter orders according to inputs
    filtered_orders AS (
        SELECT o.*
        FROM "Order" o
        WHERE o.status = 'PAID'
          AND o.suborder_of IS NULL                 -- only parent orders
          AND ($1::timestamptz IS NULL OR o.created_at >= $1)
          AND ($2::timestamptz IS NULL OR o.created_at <= $2)
          AND EXTRACT(DOW FROM o.created_at) <> 1   -- skip Mondays
          AND (
            $3::text IS NULL
            OR EXTRACT(DOW FROM o.created_at)::int = ANY (string_to_array($3::text, ',')::int[])
          )
          AND ($4::"WorkingShift" IS NULL OR o.shift = $4::"WorkingShift")
          AND (
            $5::text IS NULL OR $6::text IS NULL
            OR o.created_at::time BETWEEN $5::time AND $6::time
          )
          AND (
            $7::text IS NULL
            OR o.type = ANY (string_to_array($7::text, ',')::"OrderType"[])
          )
    ),

    -- ✅ Aggregate products by *parent* order id (suborders roll up)
    product_lines AS (
        SELECT
            COALESCE(o.suborder_of, o.id) AS parent_order_id,
            SUM(pio.paid_quantity::double precision)                                      AS total_products,
            SUM(pio.paid_quantity::double precision * pio.frozen_price::double precision) AS line_revenue,
            SUM(
              CASE
                WHEN pio.status IN ('IN_ORDER','DELETED_COOKED')
                THEN (pio.paid_quantity::double precision * pr.rice::double precision)
                ELSE 0::double precision
              END
            ) AS rice_mass,
            SUM(pr.soups::double precision  * pio.quantity::double precision)  AS soups,
            SUM(pr.rices::double precision  * pio.quantity::double precision)  AS rices,
            SUM(pr.salads::double precision * pio.quantity::double precision)  AS salads
        FROM "ProductInOrder" pio
        JOIN "Order" o   ON o.id = pio.order_id
        JOIN "Product" pr ON pr.id = pio.product_id
        GROUP BY COALESCE(o.suborder_of, o.id)
    ),

    -- ✅ Aggregate daily stats for existing orders
    raw_daily AS (
        SELECT
            DATE_TRUNC('day', fo.created_at)::date        AS day,
            fo.type                                       AS type,
            COUNT(DISTINCT fo.id)::int                    AS orders,
            COALESCE(SUM(pl.line_revenue), 0)::double precision   AS revenue,
            COALESCE(SUM(pl.total_products), 0)::double precision AS products,
            SUM(
              CASE WHEN fo.soups IS NOT NULL AND fo.soups <> 0 THEN fo.soups::double precision
                   ELSE pl.soups END
            ) AS soups,
            SUM(
              CASE WHEN fo.rices IS NOT NULL AND fo.rices <> 0 THEN fo.rices::double precision
                   ELSE pl.rices END
            ) AS rices,
            SUM(
              CASE WHEN fo.salads IS NOT NULL AND fo.salads <> 0 THEN fo.salads::double precision
                   ELSE pl.salads END
            ) AS salads,
            SUM(pl.rice_mass) AS rice
        FROM filtered_orders fo
        LEFT JOIN product_lines pl ON pl.parent_order_id = fo.id
        GROUP BY 1, 2
    )

-- ✅ FINAL OUTPUT: include all calendar days (0 values if no orders)
SELECT
    d.day,
    ot.type,
    COALESCE(rd.orders, 0) AS orders,
    COALESCE(rd.revenue, 0) AS revenue,
    COALESCE(rd.products, 0) AS products,
    COALESCE(rd.soups, 0) AS soups,
    COALESCE(rd.rices, 0) AS rices,
    COALESCE(rd.salads, 0) AS salads,
    COALESCE(rd.rice, 0) AS rice,
    CASE WHEN COALESCE(rd.orders, 0) > 0
         THEN rd.revenue / rd.orders
         ELSE 0
    END AS "revenuePerOrder"
FROM days d
CROSS JOIN (
    VALUES ('HOME'::"OrderType"), ('PICKUP'::"OrderType"), ('TABLE'::"OrderType")
) AS ot(type)
LEFT JOIN raw_daily rd ON rd.day = d.day AND rd.type = ot.type
WHERE EXTRACT(DOW FROM d.day) <> 1 -- still skip Mondays
  AND (
    $3::text IS NULL
    OR EXTRACT(DOW FROM d.day)::int = ANY (string_to_array($3::text, ',')::int[])
  )
  AND (
    $7::text IS NULL
    OR ot.type = ANY (string_to_array($7::text, ',')::"OrderType"[])
  )
ORDER BY d.day, ot.type;
