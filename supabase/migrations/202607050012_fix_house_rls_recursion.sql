create or replace function public.user_owns_house(target_house_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.houses
    where id = target_house_id
      and owner_user_id = auth.uid()
  )
$$;

create or replace function public.user_can_access_house(target_house_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.user_owns_house(target_house_id)
    or exists (
      select 1
      from public.house_members
      where house_id = target_house_id
        and member_user_id = auth.uid()
        and status = 'active'
    )
$$;
