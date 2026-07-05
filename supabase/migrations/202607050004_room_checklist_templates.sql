alter table public.checklist_templates
  add column if not exists room_id uuid references public.rooms(id) on delete cascade;

create index if not exists checklist_templates_room_id_idx on public.checklist_templates (room_id);
