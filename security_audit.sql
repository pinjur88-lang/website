-- SECURITY AUDIT SCRIPT
-- Lists all tables and their RLS status.
-- Lists all active policies.

-- 1. Check RLS Status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. List Configured Policies
SELECT * FROM pg_policies;
