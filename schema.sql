-- Define custom types
CREATE TYPE public.user_role AS ENUM (
    'admin',
    'staff',
    'user'
);

-- Define sequences
CREATE SEQUENCE public.brands_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE public.products_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

-- Create brands table
CREATE TABLE public.brands (
    id integer NOT NULL DEFAULT nextval('public.brands_id_seq'::regclass),
    brand_name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT brands_pkey PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE public.products (
    id integer NOT NULL DEFAULT nextval('public.products_id_seq'::regclass),
    product_name character varying NOT NULL,
    product_description text NULL,
    brand_id integer NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id uuid NOT NULL DEFAULT auth.uid(), -- Note: auth.uid() is Supabase specific
    email text NOT NULL,
    fullname text NOT NULL,
    "phoneNumber" text NOT NULL, -- Quoted because of case sensitivity/special characters
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT user_profiles_email_key UNIQUE (email),
    CONSTRAINT user_profiles_phone_key UNIQUE ("phoneNumber")
);

-- Create requests table
CREATE TABLE public.requests (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id integer NULL,
    product_name text NOT NULL,
    brand_id integer NULL,
    brand_name text NOT NULL,
    quantity integer NOT NULL,
    user_id uuid NULL,
    full_name text NOT NULL,
    country text NOT NULL,
    address text NOT NULL,
    post_code text NOT NULL,
    tel_no text NOT NULL,
    email text NOT NULL,
    company_name text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    createdby uuid NULL,
    updatedby uuid NULL,
    comment text NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT requests_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
    CONSTRAINT requests_createdby_fkey FOREIGN KEY (createdby) REFERENCES public.user_profiles(id),
    CONSTRAINT requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
    CONSTRAINT requests_updatedby_fkey FOREIGN KEY (updatedby) REFERENCES public.user_profiles(id),
    CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Note: This schema is generated based on information_schema queries.
-- It might not include all database objects like triggers, RLS policies,
-- specific index types, or functions beyond defaults. For a complete backup,
-- consider using pg_dump. 