alter table public.checklist_runs
  add constraint checklist_runs_cleaning_job_room_unique unique (cleaning_job_id, room_id);

alter table public.checklist_run_items
  add constraint checklist_run_items_run_template_unique unique (checklist_run_id, template_item_id);
