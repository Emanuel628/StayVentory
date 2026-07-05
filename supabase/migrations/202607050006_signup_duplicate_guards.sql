create or replace function public.email_exists_for_signup(target_email text)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from auth.users
    where lower(email) = lower(target_email)
  )
$$;

revoke all on function public.email_exists_for_signup(text) from public;
grant execute on function public.email_exists_for_signup(text) to anon, authenticated;
