CREATE OR REPLACE VIEW public_tables AS 
SELECT 
  table_schema, 
  table_name 
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' 
  AND table_name NOT LIKE '\_%' ESCAPE '\';