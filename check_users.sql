-- CHECK REGISTERED USERS
-- Run this to see who is actually in your database.

SELECT 
    id, 
    email, 
    created_at, 
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
