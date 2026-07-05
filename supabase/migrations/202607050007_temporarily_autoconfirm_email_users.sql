update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, timezone('utc', now()))
where email is not null
  and email_confirmed_at is null;

create or replace function public.temporarily_autoconfirm_email_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.email is not null and new.email_confirmed_at is null then
    update auth.users
    set
      email_confirmed_at = timezone('utc', now())
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_autoconfirm_email on auth.users;

create trigger on_auth_user_autoconfirm_email
  after insert on auth.users
  for each row execute procedure public.temporarily_autoconfirm_email_user();
