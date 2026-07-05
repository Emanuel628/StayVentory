alter table public.room_inventory_items
  add column if not exists description text,
  add column if not exists maximum_quantity integer not null default 0;
