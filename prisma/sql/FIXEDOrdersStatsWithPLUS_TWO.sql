-- @param {DateTime} $1:from?         Start datetime of the period (nullable, inclusive)
-- @param {DateTime} $2:to?           End datetime of the period (nullable, inclusive)
-- @param {String}   $3:weekdays?     Allowed weekdays as comma-separated string (nullable, e.g. '2,5')  -- 0=Sun..6=Sat
-- @param {WorkingShift} $4:shift?    Working shift filter (nullable; use 'ALL' or NULL to ignore)
-- @param {String}   $5:from_time?    Start time of day "HH:mm" (nullable)
-- @param {String}   $6:to_time?      End time of day "HH:mm" (nullable)
-- @param {String}   $7:orderTypes?   Allowed order types as comma-separated string (nullable, e.g. 'TABLE,PICKUP')

WITH
    /* Generate calendar days (dates) from $1..$2.
       These are plain dates, interpreted as Rome when needed. */
    days AS (
        SELECT generate_series(
            COALESCE($1::timestamptz, (SELECT MIN(created_at) FROM "Order")),
            COALESCE($2::timestamptz, NOW()),
            interval '1 day'
        )::date AS day
    ),

    /* Days that have at least one PAID order (Rome-local date). */
    order_days AS (
        SELECT DISTINCT (o.created_at AT TIME ZONE 'Europe/Rome')::date AS day
        FROM "Order" o
        WHERE o.status = 'PAID'
    ),

    /* Days that have at least one payment (Rome-local date). Keep as reference (not used below). */
    payment_days AS (
        SELECT DISTINCT (p.created_at AT TIME ZONE 'Europe/Rome')::date AS day
        FROM "Payment" p
    ),

    /* Worked days = generated days ∩ order_days, with weekday filter (Rome-local weekday). */
    worked_days AS (
        SELECT d.day
        FROM days d
        JOIN order_days od ON od.day = d.day
        WHERE EXTRACT(DOW FROM d.day) <> 1  -- skip Mondays by default
          AND (
            $3::text IS NULL
            OR EXTRACT(DOW FROM d.day)::int = ANY (string_to_array($3::text, ',')::int[])
          )
    ),

    /* Number of worked days (≥ 1 to avoid division by zero). */
    num_days AS (
        SELECT GREATEST(COUNT(*), 1)::int AS cnt
        FROM worked_days
    ),

    /* Compute a Rome-local timestamp once per order, then filter on that.
       IMPORTANT:
       - This makes all date/weekday/time logic independent of session timezone.
       - If you ever need to compensate the legacy ~-2h skew for pre-migration rows,
         you can replace 'o.created_at' below with '(o.created_at + INTERVAL ''2 hours'')'.
         Example:
           (o.created_at + INTERVAL '2 hours') AT TIME ZONE 'Europe/Rome' AS local_ts
    */
    filtered_orders AS (
        SELECT o.*
        FROM (
            SELECT
                o.*,
                (
                    CASE
                        WHEN o.created_at < TIMESTAMP WITH TIME ZONE '2025-10-19 00:00:00+02'
                        THEN (o.created_at + INTERVAL '2 hours') AT TIME ZONE 'Europe/Rome'
                        ELSE  (o.created_at AT TIME ZONE 'Europe/Rome')
                    END
                ) AS local_ts
            FROM "Order" o
        ) o
        WHERE o.status = 'PAID'
          AND o.suborder_of IS NULL                               -- ✅ only parent orders
          -- Rome-local date window (inclusive)
          AND (
              $1::timestamptz IS NULL
              OR o.local_ts::date >= ($1 AT TIME ZONE 'Europe/Rome')::date
          )
          AND (
              $2::timestamptz IS NULL
              OR o.local_ts::date <= ($2 AT TIME ZONE 'Europe/Rome')::date
          )
          -- Weekday filter in Rome; skip Mondays by default
          AND EXTRACT(DOW FROM o.local_ts) <> 1
          AND (
              $3::text IS NULL
              OR EXTRACT(DOW FROM o.local_ts)::int = ANY (string_to_array($3::text, ',')::int[])
          )
          -- Shift filter (enum). Pass NULL or 'ALL' (castable) to ignore.
          AND (
              $4::"WorkingShift" IS NULL
              OR o.shift = $4::"WorkingShift"
          )
          -- Time-of-day window in Rome, supports overnight windows (e.g., 22:00→02:00)
          AND (
              $5::text IS NULL OR $6::text IS NULL
              OR (
                   ($5::time <= $6::time AND o.local_ts::time BETWEEN $5::time AND $6::time)
                OR ($5::time >  $6::time AND (o.local_ts::time >= $5::time OR o.local_ts::time <= $6::time))
              )
          )
          -- Allowed order types (enum list)
          AND (
              $7::text IS NULL
              OR o.type = ANY (string_to_array($7::text, ',')::"OrderType"[])
          )
    ),

    /* ✅ Aggregate products by *parent* order id, so suborder items roll up */
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
        JOIN "Order"   o  ON o.id = pio.order_id
        JOIN "Product" pr ON pr.id = pio.product_id
        GROUP BY COALESCE(o.suborder_of, o.id)
    ),

    order_stats AS (
        SELECT
            fo.type,
            COUNT(DISTINCT fo.id)::int                           AS orders,            -- ✅ parents only
            COALESCE(SUM(pl.line_revenue), 0::double precision)   AS revenue,          -- ✅ suborders included via roll-up
            COALESCE(SUM(pl.total_products), 0::double precision) AS products,         -- ✅ suborders included via roll-up
            SUM(
              CASE WHEN fo.soups  IS NOT NULL AND fo.soups  <> 0 THEN fo.soups  ::double precision ELSE pl.soups  END
            ) AS soups,
            SUM(
              CASE WHEN fo.rices  IS NOT NULL AND fo.rices  <> 0 THEN fo.rices  ::double precision ELSE pl.rices  END
            ) AS rices,
            SUM(
              CASE WHEN fo.salads IS NOT NULL AND fo.salads <> 0 THEN fo.salads ::double precision ELSE pl.salads END
            ) AS salads,
            SUM(pl.rice_mass) AS rice
        FROM filtered_orders fo
        LEFT JOIN product_lines pl ON pl.parent_order_id = fo.id
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
    (os.revenue::double precision / NULLIF(os.orders,0)::double precision)      AS "revenuePerOrder",
    (os.orders::double precision  / nd.cnt::double precision)                    AS "ordersPerDay",
    (os.revenue::double precision / nd.cnt::double precision)                    AS "revenuePerDay",
    (os.products::double precision/ nd.cnt::double precision)                    AS "productsPerDay",
    (os.soups::double precision    / nd.cnt::double precision)                   AS "soupsPerDay",
    (os.rices::double precision    / nd.cnt::double precision)                   AS "ricesPerDay",
    (os.salads::double precision   / nd.cnt::double precision)                   AS "saladsPerDay",
    (os.rice::double precision     / nd.cnt::double precision)                   AS "ricePerDay"
FROM order_stats os
CROSS JOIN num_days nd;
