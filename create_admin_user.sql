-- ==========================================
-- CREATE ADMIN USER DIRECTLY (SQL) - FIXED
-- ==========================================

-- PREREQUISITE:
-- You must have the pgcrypto extension enabled to hash passwords.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_email TEXT := 'udrugabaljci@gmail.com';
    new_password TEXT := 'password123'; -- Change this if you want
    new_id UUID := gen_random_uuid();
BEGIN
    -- 1. Check if user already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email ILIKE new_email) THEN
        RAISE NOTICE 'User % already exists. Skipping creation.', new_email;
        -- If user exists, just ensure they are admin
        UPDATE public.profiles
        SET role = 'admin'
        WHERE id = (SELECT id FROM auth.users WHERE email ILIKE new_email LIMIT 1);
        
    ELSE
        -- 2. Insert into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_id,
            'authenticated',
            'authenticated',
            new_email,
            crypt(new_password, gen_salt('bf')), -- secure hash
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"display_name": "Admin Baljci"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Created user % with password %', new_email, new_password;
        
        -- 3. Create Profile
        -- REVISION: Removed 'email' column from profiles table insert
        INSERT INTO public.profiles (id, role, display_name)
        VALUES (new_id, 'admin', 'Admin Baljci')
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin';
        
    END IF;

END $$;
