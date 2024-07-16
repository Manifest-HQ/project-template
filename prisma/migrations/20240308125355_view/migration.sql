CREATE OR REPLACE VIEW public_tables AS 
SELECT tables.table_schema,
       tables.table_name,
       '[' || string_agg('"' || columns.column_name || '"', ',') || ']' AS column_names
FROM information_schema.tables AS tables
JOIN information_schema.columns AS columns
  ON tables.table_schema = columns.table_schema
  AND tables.table_name = columns.table_name
WHERE tables.table_schema = 'public'
  AND tables.table_name NOT LIKE '\_%'
  AND tables.table_type = 'BASE TABLE'
GROUP BY tables.table_schema, tables.table_name;

