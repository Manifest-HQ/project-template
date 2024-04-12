DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I;', table_record.tablename);
    END LOOP;
END $$;
