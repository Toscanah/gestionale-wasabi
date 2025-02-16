DO $$ 
DECLARE 
    r RECORD;
    result BIGINT;
BEGIN
    FOR r IN (
        SELECT 
            quote_ident(c.relname) AS table_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        JOIN pg_attribute a ON a.attrelid = c.oid
        WHERE c.relkind = 'r'
        AND n.nspname = 'public'
        AND a.attname = 'id'
        AND a.attnum > 0
        AND NOT a.attisdropped
    ) 
    LOOP
        EXECUTE format(
            'SELECT setval(pg_get_serial_sequence(''%s'', ''id''), COALESCE((SELECT MAX(id) + 1 FROM %s), 1), false);',
            r.table_name, r.table_name
        ) INTO result;
        
        RAISE NOTICE 'Table: %, New Sequence Value: %', r.table_name, result;
    END LOOP;
END $$;