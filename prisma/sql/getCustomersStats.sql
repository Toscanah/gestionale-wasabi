-- @param {DateTime} $1:from? Start date of the period (nullable)
-- @param {DateTime} $2:to? End date of the period (nullable)
-- @param {String} $3:query? Free-text search (nullable)
-- @param {Int} $4:offset Pagination offset
-- @param {Int} $5:limit? Pagination limit (nullable, no limit if null)
-- @param {String} $6:customerOrigins? Comma separated string of origins (nullable)

WITH
    -- ✅ Collect all customer–order relationships (both Home and Pickup)
    customer_orders AS (
        SELECT
            ho.customer_id,
            COALESCE(o.suborder_of, o.id) AS parent_order_id,
            o.created_at
        FROM public."HomeOrder" ho
        JOIN public."Order" o ON o.id = ho.id

        UNION ALL

        SELECT
            po.customer_id,
            COALESCE(o.suborder_of, o.id) AS parent_order_id,
            o.created_at
        FROM public."PickupOrder" po
        JOIN public."Order" o ON o.id = po.id
    ),

    -- ✅ Aggregate order stats per customer (Rome-local filtering)
    order_stats AS (
        SELECT
            co.customer_id,
            COUNT(DISTINCT co.parent_order_id) AS total_orders,
            COALESCE(SUM(pio.quantity::double precision * pio.frozen_price::double precision), 0) AS total_spent,
            MIN(co.created_at) AS first_order_at,
            MAX(co.created_at) AS last_order_at,
            
            -- ✅ Count orders only in the last 30 days (Rome-local)
            COUNT(
                DISTINCT CASE
                    WHEN (co.created_at AT TIME ZONE 'Europe/Rome')::date >= ((CURRENT_DATE - INTERVAL '30 days') AT TIME ZONE 'Europe/Rome')::date
                    THEN co.parent_order_id
                END
            ) AS recent_orders_30d
        FROM
            customer_orders co
            JOIN public."ProductInOrder" pio 
              ON pio.order_id = co.parent_order_id
             AND pio.status = 'IN_ORDER'
        WHERE
            -- ✅ Rome-local date filtering
            ($1::timestamptz IS NULL OR (co.created_at AT TIME ZONE 'Europe/Rome')::date >= ($1 AT TIME ZONE 'Europe/Rome')::date)
            AND ($2::timestamptz IS NULL OR (co.created_at AT TIME ZONE 'Europe/Rome')::date <= ($2 AT TIME ZONE 'Europe/Rome')::date)
        GROUP BY
            co.customer_id
    )

-- ✅ Final customer-level result
SELECT
    c.id AS "customerId",
    COALESCE(os.total_orders, 0)::int AS "totalOrders",
    COALESCE(os.total_spent, 0)::double precision AS "totalSpent",
    COALESCE(
        CASE
            WHEN os.total_orders > 0 THEN 
                (os.total_spent::double precision / os.total_orders::double precision)
        END,
        0
    ) AS "averageOrder",

    -- ✅ Convert order times to Rome-local for reporting
    (os.first_order_at AT TIME ZONE 'Europe/Rome') AS "firstOrderAt",
    (os.last_order_at AT TIME ZONE 'Europe/Rome')  AS "lastOrderAt",

    -- ✅ Compute recency (in days) relative to CURRENT_DATE in Rome time
    COALESCE(
        CASE
            WHEN os.last_order_at IS NOT NULL THEN
                (CURRENT_DATE - (os.last_order_at AT TIME ZONE 'Europe/Rome')::date)
        END,
        0
    ) AS "recency",

    -- ✅ Frequency = orders in the last 30 days
    COALESCE(os.recent_orders_30d, 0)::int AS "frequency",

    -- ✅ Monetary = lifetime total spent
    COALESCE(os.total_spent, 0)::double precision AS "monetary"

FROM public."Customer" c
LEFT JOIN order_stats os ON os.customer_id = c.id
LEFT JOIN public."Phone" ph ON ph.id = c.phone_id
LEFT JOIN public."Address" ad ON ad.customer_id = c.id

WHERE
    -- ✅ Free-text search
    (
        $3::text IS NULL
        OR c.name ILIKE '%' || $3::text || '%'
        OR c.surname ILIKE '%' || $3::text || '%'
        OR c.email ILIKE '%' || $3::text || '%'
        OR ph.phone ILIKE '%' || $3::text || '%'
        OR ad.doorbell ILIKE '%' || $3::text || '%'
    )

    -- ✅ Filter by customer origin
    AND (
        $6::text IS NULL
        OR c.origin = ANY (string_to_array($6::text, ',')::"CustomerOrigin"[])
    )

GROUP BY
    c.id,
    c.name,
    c.surname,
    c.email,
    ph.phone,
    os.total_orders,
    os.total_spent,
    os.first_order_at,
    os.last_order_at,
    os.recent_orders_30d
OFFSET $4
LIMIT $5;
