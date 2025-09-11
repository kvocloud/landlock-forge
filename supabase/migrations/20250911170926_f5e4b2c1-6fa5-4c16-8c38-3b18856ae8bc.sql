-- Update profiles table to support ADMIN role
-- First, let's update the existing user to ADMIN role
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE full_name = 'Kivo';

-- Create a function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.user_id = $1 AND role = 'ADMIN'
  );
$$;

-- Add RLS policy for admin access to all listings
CREATE POLICY "Admins can view all listings" 
ON public.listings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update all listings" 
ON public.listings 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid())
);

-- Add RLS policy for admin access to all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid())
);

-- Add admin access to notifications
CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid())
);