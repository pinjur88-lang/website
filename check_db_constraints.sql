SELECT table_name,
    column_name,
    is_nullable,
    column_default,
    data_type
FROM information_schema.columns
WHERE table_name IN ('profiles', 'requests')
ORDER BY table_name,
    ordinal_position;