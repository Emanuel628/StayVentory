create policy "users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());
