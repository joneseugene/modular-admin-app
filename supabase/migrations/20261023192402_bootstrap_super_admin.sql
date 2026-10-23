
-- Bootstrap the initial super administrator.
-- The Auth user must already exist.
-- This migration deliberately fails if the account or profile is missing.

DO $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
  v_is_active BOOLEAN;
BEGIN
  -- Find the intended Supabase Auth account.
  SELECT id
  INTO v_user_id
  FROM auth.users
  WHERE lower(email) = lower('joneseugeneceo@gmail.com');

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'Auth user joneseugeneceo@gmail.com does not exist. Create the user in Supabase Authentication first.';
  END IF;

  -- Confirm that the profile trigger created the profile.
  SELECT is_active
  INTO v_is_active
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'No profile exists for joneseugeneceo@gmail.com. Check the new-user profile trigger before continuing.';
  END IF;

  IF v_is_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION
      'The profile for joneseugeneceo@gmail.com is not active. Activate it through the appropriate administrative process first.';
  END IF;

  -- Find the seeded system role.
  SELECT id
  INTO v_role_id
  FROM public.roles
  WHERE slug = 'super_admin';

  IF v_role_id IS NULL THEN
    RAISE EXCEPTION
      'The super_admin role is missing. Apply the platform seed migration first.';
  END IF;

  -- Assign the role idempotently.
  INSERT INTO public.user_roles (
    user_id,
    role_id,
    assigned_by
  )
  VALUES (
    v_user_id,
    v_role_id,
    v_user_id
  )
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RAISE NOTICE
    'Successfully assigned super_admin to joneseugeneceo@gmail.com (user ID: %).',
    v_user_id;
END;
$$;
