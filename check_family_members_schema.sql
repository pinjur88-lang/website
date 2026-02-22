SELECT column_name,
    is_nullable,
    column_default,
    data_type
FROM information_schema.columns
WHERE table_name = 'family_members'
ORDER BY ordinal_position;