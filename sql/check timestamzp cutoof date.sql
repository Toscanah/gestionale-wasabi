SET TIME ZONE 'Europe/Berlin';

-- Plug in your date below (example: '2025-10-14')

SELECT
  -- ✅ CORRECT: filters using Rome local time (converted to UTC window)
  COUNT(*) FILTER (
    WHERE (o.created_at AT TIME ZONE 'Europe/Rome')::time BETWEEN TIME '19:00' AND TIME '22:30'
      AND (o.created_at AT TIME ZONE 'Europe/Rome')::date = '2025-10-19'::date
      AND o.status = 'PAID'
      AND o.suborder_of IS NULL
  ) AS count_rome_window,

  -- ❌ NAIVE: raw UTC filtering, ignoring Rome timezone
  COUNT(*) FILTER (
    WHERE (o.created_at AT TIME ZONE 'UTC')::time BETWEEN TIME '19:00' AND TIME '22:30'
      AND (o.created_at AT TIME ZONE 'UTC')::date = '2025-10-19'::date
      AND o.status = 'PAID'
      AND o.suborder_of IS NULL
  ) AS count_naive_utc_window

 
FROM "Order" o;
