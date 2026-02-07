-- ==========================================
-- GRANT ADMIN PRIVILEGES (ROBUST VERSION)
-- ==========================================

DO $$
DECLARE
    -- INPUT: Update this line with your email (case doesn't matter now)
    target_email TEXT := 'Udrugabaljci@gmail.com'; 
    
    target_id UUID;
BEGIN
    -- 1. Find the User's ID (Case Insensitive Search)
    SELECT id INTO target_id
    FROM auth.users
    WHERE email ILIKE target_email
    LIMIT 1;

    -- 2. Check if user exists
    IF target_id IS NULL THEN
        RAISE EXCEPTION 'User "%" not found! Have you signed up/registered this email yet?', target_email;
    END IF;

    -- 3. Update Role in public.profiles
    -- We try to update, if no row exists in profiles (rare but possible), we insert.
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = target_id;

    IF NOT FOUND THEN
        INSERT INTO public.profiles (id, email, role)
        VALUES (target_id, LOWER(target_email), 'admin');
        RAISE NOTICE 'Created profile and made user % an admin.', target_email;
    ELSE
        RAISE NOTICE 'Success! User % is now an admin.', target_email;
    END IF;

END $$;
