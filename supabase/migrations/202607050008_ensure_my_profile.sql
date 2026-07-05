create or replace function public.ensure_my_profile(
  profile_role public.app_role,
  profile_email text default null,
  profile_display_name text default null,
  profile_username text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  ensured_profile public.profiles;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (
    id,
    email,
    username,
    display_name,
    role
  )
  values (
    current_user_id,
    nullif(profile_email, ''),
    nullif(profile_username, ''),
    nullif(profile_display_name, ''),
    profile_role
  )
  on conflict (id) do update
  set
    email = coalesce(public.profiles.email, excluded.email),
    username = coalesce(public.profiles.username, excluded.username),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    role = coalesce(public.profiles.role, excluded.role),
    updated_at = timezone('utc', now())
  returning * into ensured_profile;

  return ensured_profile;
end;
$$;

revoke all on function public.ensure_my_profile(public.app_role, text, text, text) from public;
grant execute on function public.ensure_my_profile(public.app_role, text, text, text) to authenticated;
