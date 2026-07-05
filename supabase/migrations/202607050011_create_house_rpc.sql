create or replace function public.create_house(
  property_name text,
  property_address_line_1 text,
  property_city text,
  property_state text,
  property_postal_code text,
  property_address_line_2 text default null,
  property_country text default 'US'
)
returns public.houses
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  created_house public.houses;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.houses (
    owner_user_id,
    name,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country
  )
  values (
    current_user_id,
    trim(property_name),
    trim(property_address_line_1),
    nullif(trim(coalesce(property_address_line_2, '')), ''),
    trim(property_city),
    trim(property_state),
    trim(property_postal_code),
    coalesce(nullif(trim(coalesce(property_country, '')), ''), 'US')
  )
  returning * into created_house;

  return created_house;
end;
$$;

revoke all on function public.create_house(text, text, text, text, text, text, text) from public;
grant execute on function public.create_house(text, text, text, text, text, text, text) to authenticated;
