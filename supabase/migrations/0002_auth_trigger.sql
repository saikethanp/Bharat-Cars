-- Create a trigger to automatically create a profile and default role when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Assign default 'viewer' role (or 'admin' if you want to hardcode for first user, but safer to default to viewer)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'viewer');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
