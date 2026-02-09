-- SECURITY UPDATE: Secure Roles
-- Ensure new users don't get 'member' role automatically from client metadata

-- 1. Create a trigger function to handle new user Profiles
-- (Assuming one might exist, we replace or create it)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id, 
    new.email, 
    'pending', -- FORCE DEFAULT TO PENDING
    new.raw_user_meta_data->>'display_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure Trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Update existing profiles with NULL role to 'pending' if necessary
-- BE CAREFUL: Don't lock out existing admins
UPDATE profiles SET role = 'pending' WHERE role IS NULL;

-- 4. Grant Admin/Service Role permissions just in case
GRANT SELECT, UPDATE ON profiles TO service_role;
