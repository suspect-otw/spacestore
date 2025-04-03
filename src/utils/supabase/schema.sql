/* USERS TABLE IN SUPABASE (public.user_profiles)*/
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT auth.uid(),
  email text NOT NULL,
  fullname text NOT NULL,
  "phoneNumber" text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  role public.user_role NOT NULL DEFAULT 'user'::user_role,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_email_key UNIQUE (email),
  CONSTRAINT user_profiles_phone_key UNIQUE ("phoneNumber")
);

-- Step 1: Create an enum type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');

-- Step 2: Add the new role column using the enum type
ALTER TABLE public.user_profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

/* REUQUESTS TABLE IN SUPABASE (public.requests)*/

CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id int REFERENCES public.products(id),
  product_name text NOT NULL,
  brand_id int REFERENCES public.brands(id),
  brand_name text NOT NULL,
  quantity int NOT NULL,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  post_code text NOT NULL,
  tel_no text NOT NULL,
  email text NOT NULL,
  company_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  createdBy uuid REFERENCES public.user_profiles(id),
  updatedBy uuid REFERENCES public.user_profiles(id),
  comment text,
  status text NOT NULL DEFAULT 'pending'
);

- Policies (if not already created)
-- Policy for admins and staff to change status
CREATE POLICY "Admins and staff can change status" 
ON public.requests
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE role IN ('admin', 'staff'))
)
WITH CHECK (
  status IN ('accepted', 'rejected')
);

-- Policy for users to change their own status to cancelled
CREATE POLICY "Users can cancel their own requests" 
ON public.requests
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  status = 'cancelled'
);