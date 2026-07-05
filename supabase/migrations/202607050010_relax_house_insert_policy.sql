drop policy if exists "owners create houses" on public.houses;

create policy "owners create houses"
  on public.houses for insert
  to authenticated
  with check (owner_user_id = auth.uid());
