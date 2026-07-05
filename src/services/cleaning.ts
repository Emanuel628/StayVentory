import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

type ChecklistResponseStatus = 'pending' | 'cleaned' | 'restocked' | 'needs_attention' | 'item_missing' | 'damage_found';
type ChecklistRunStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
type CleaningJobStatus = 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';

function toIsoString(date: Date) {
  return date.toISOString();
}

function deriveRunStatus(statuses: ChecklistResponseStatus[]): ChecklistRunStatus {
  const answeredStatuses = statuses.filter((status) => status && status !== 'pending');

  if (!answeredStatuses.length) {
    return 'pending';
  }

  if (answeredStatuses.some((status) => status === 'needs_attention' || status === 'item_missing' || status === 'damage_found')) {
    return 'blocked';
  }

  return answeredStatuses.length === statuses.length ? 'completed' : 'in_progress';
}

function deriveJobStatus(runStatuses: ChecklistRunStatus[]): CleaningJobStatus {
  if (!runStatuses.length || runStatuses.every((status) => status === 'pending')) {
    return 'scheduled';
  }

  if (runStatuses.some((status) => status === 'blocked')) {
    return 'blocked';
  }

  return runStatuses.every((status) => status === 'completed') ? 'submitted' : 'in_progress';
}

export async function listOwnerCleaningJobs() {
  const supabase = requireSupabase();

  return supabase
    .from('cleaning_jobs')
    .select(
      `
        id,
        house_id,
        assigned_user_id,
        scheduled_for,
        status,
        owner_note,
        cleaner_note,
        started_at,
        completed_at,
        submitted_at,
        created_at,
        houses (
          id,
          name,
          address_line_1,
          city,
          state,
          postal_code
        ),
        assigned_profile:profiles!cleaning_jobs_assigned_user_id_fkey (
          id,
          display_name,
          email,
          username
        )
      `,
    )
    .order('scheduled_for', { ascending: true });
}

export async function listAssignedCleaningJobs(userId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('cleaning_jobs')
    .select(
      `
        id,
        house_id,
        assigned_user_id,
        scheduled_for,
        status,
        owner_note,
        cleaner_note,
        started_at,
        completed_at,
        submitted_at,
        created_at,
        houses (
          id,
          name,
          address_line_1,
          city,
          state,
          postal_code
        )
      `,
    )
    .eq('assigned_user_id', userId)
    .order('scheduled_for', { ascending: true });
}

export async function listHouseAssignableMembers(houseId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('house_members')
    .select(
      `
        id,
        house_id,
        member_user_id,
        status,
        can_manage_access,
        created_at,
        invite_code,
        profile:profiles!house_members_member_user_id_fkey (
          id,
          display_name,
          email,
          username,
          role
        )
      `,
    )
    .eq('house_id', houseId)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
}

export async function createCleaningJob(input: {
  houseId: string;
  scheduledFor: string;
  assignedUserId?: string | null;
  ownerNote?: string | null;
}) {
  const supabase = requireSupabase();

  const createResult = await supabase
    .from('cleaning_jobs')
    .insert({
      house_id: input.houseId,
      assigned_user_id: input.assignedUserId ?? null,
      scheduled_for: input.scheduledFor,
      owner_note: input.ownerNote ?? null,
    })
    .select()
    .single();

  if (createResult.error || !createResult.data) {
    return createResult;
  }

  const runResult = await ensureChecklistRunsForJob(createResult.data.id);

  if (runResult.error) {
    return { data: createResult.data, error: runResult.error };
  }

  return createResult;
}

export async function ensureChecklistRunsForJob(cleaningJobId: string) {
  const supabase = requireSupabase();

  const { data: job, error: jobError } = await supabase
    .from('cleaning_jobs')
    .select('id, house_id')
    .eq('id', cleaningJobId)
    .single();

  if (jobError || !job) {
    return { data: null, error: jobError ?? new Error('Cleaning job not found.') };
  }

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('id, house_id, name, room_type, icon_key, instructions, sort_order, created_at')
    .eq('house_id', job.house_id)
    .order('sort_order', { ascending: true });

  if (roomsError) {
    return { data: null, error: roomsError };
  }

  if (!rooms?.length) {
    return { data: [], error: null };
  }

  const roomIds = rooms.map((room: any) => room.id);

  const { data: templates, error: templatesError } = await supabase
    .from('checklist_templates')
    .select(
      `
        id,
        room_id,
        checklist_template_items (
          id,
          label,
          sort_order,
          required_photo
        )
      `,
    )
    .in('room_id', roomIds);

  if (templatesError) {
    return { data: null, error: templatesError };
  }

  const templateByRoomId = new Map((templates ?? []).map((template: any) => [template.room_id, template]));
  const createdRuns: any[] = [];

  for (const room of rooms) {
    const runResult = await supabase
      .from('checklist_runs')
      .upsert(
        {
          cleaning_job_id: cleaningJobId,
          room_id: room.id,
        },
        { onConflict: 'cleaning_job_id,room_id' },
      )
      .select('id, cleaning_job_id, room_id, status, completed_at')
      .single();

    if (runResult.error || !runResult.data) {
      return { data: null, error: runResult.error ?? new Error('Checklist run could not be created.') };
    }

    createdRuns.push(runResult.data);

    const template = templateByRoomId.get(room.id) as any;
    const templateItems = template?.checklist_template_items ?? [];

    if (!templateItems.length) {
      continue;
    }

    const runItems = templateItems.map((item: any) => ({
      checklist_run_id: runResult.data.id,
      template_item_id: item.id,
      photo_required: item.required_photo,
    }));

    const upsertItemsResult = await supabase
      .from('checklist_run_items')
      .upsert(runItems, { onConflict: 'checklist_run_id,template_item_id' });

    if (upsertItemsResult.error) {
      return { data: null, error: upsertItemsResult.error };
    }
  }

  return { data: createdRuns, error: null };
}

export async function getCleaningJobDetail(cleaningJobId: string) {
  const supabase = requireSupabase();

  const { data: job, error: jobError } = await supabase
    .from('cleaning_jobs')
    .select(
      `
        id,
        house_id,
        assigned_user_id,
        scheduled_for,
        status,
        owner_note,
        cleaner_note,
        created_at,
        started_at,
        submitted_at,
        reviewed_at,
        completed_at,
        houses (
          id,
          name,
          owner_user_id,
          address_line_1,
          address_line_2,
          city,
          state,
          postal_code,
          country
        ),
        assigned_profile:profiles!cleaning_jobs_assigned_user_id_fkey (
          id,
          display_name,
          email,
          username,
          phone
        )
      `,
    )
    .eq('id', cleaningJobId)
    .single();

  if (jobError || !job) {
    return { data: null, error: jobError ?? new Error('Cleaning job not found.') };
  }

  const ensureResult = await ensureChecklistRunsForJob(cleaningJobId);

  if (ensureResult.error) {
    return { data: null, error: ensureResult.error };
  }

  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('id, display_name, email, phone, username')
    .eq('id', job.houses.owner_user_id)
    .maybeSingle();

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('id, house_id, name, room_type, icon_key, instructions, sort_order, created_at')
    .eq('house_id', job.house_id)
    .order('sort_order', { ascending: true });

  if (roomsError) {
    return { data: null, error: roomsError };
  }

  const { data: runs, error: runsError } = await supabase
    .from('checklist_runs')
    .select('id, cleaning_job_id, room_id, status, completed_at')
    .eq('cleaning_job_id', cleaningJobId);

  if (runsError) {
    return { data: null, error: runsError };
  }

  const runIds = (runs ?? []).map((run: any) => run.id);
  const itemsResult = runIds.length
    ? await supabase
        .from('checklist_run_items')
        .select(
          `
            id,
            checklist_run_id,
            template_item_id,
            response_status,
            note,
            photo_required,
            photo_count,
            completed_at,
            template_item:checklist_template_items!checklist_run_items_template_item_id_fkey (
              id,
              label,
              sort_order,
              required_photo
            )
          `,
        )
        .in('checklist_run_id', runIds)
    : { data: [], error: null };

  if (itemsResult.error) {
    return { data: null, error: itemsResult.error };
  }

  const itemsByRunId = new Map<string, any[]>();

  for (const item of itemsResult.data ?? []) {
    const currentItems = itemsByRunId.get(item.checklist_run_id) ?? [];
    currentItems.push(item);
    itemsByRunId.set(item.checklist_run_id, currentItems);
  }

  const roomById = new Map((rooms ?? []).map((room: any) => [room.id, room]));
  const runDetails = (runs ?? [])
    .map((run: any) => {
      const runRoom = roomById.get(run.room_id) ?? null;
      const runItems = (itemsByRunId.get(run.id) ?? []).slice().sort((a: any, b: any) => {
        return (a.template_item?.sort_order ?? 0) - (b.template_item?.sort_order ?? 0);
      });

      return {
        ...run,
        room: runRoom,
        items: runItems,
      };
    })
    .sort((a: any, b: any) => {
      return (a.room?.sort_order ?? 0) - (b.room?.sort_order ?? 0) || (a.room?.name ?? '').localeCompare(b.room?.name ?? '');
    });

  return {
    data: {
      ...job,
      owner_profile: ownerProfile ?? null,
      runs: runDetails,
    },
    error: null,
  };
}

export async function updateChecklistRunItem(input: {
  runItemId: string;
  responseStatus: ChecklistResponseStatus;
  note?: string | null;
}) {
  const supabase = requireSupabase();
  const completedAt = input.responseStatus === 'pending' ? null : toIsoString(new Date());

  const { data: updatedItem, error: updateError } = await supabase
    .from('checklist_run_items')
    .update({
      response_status: input.responseStatus,
      note: input.note ?? null,
      completed_at: completedAt,
    })
    .eq('id', input.runItemId)
    .select('id, checklist_run_id, response_status')
    .single();

  if (updateError || !updatedItem) {
    return { data: null, error: updateError ?? new Error('Checklist item could not be updated.') };
  }

  const { data: runItems, error: runItemsError } = await supabase
    .from('checklist_run_items')
    .select('response_status')
    .eq('checklist_run_id', updatedItem.checklist_run_id);

  if (runItemsError) {
    return { data: null, error: runItemsError };
  }

  const statuses = (runItems ?? []).map((item: any) => (item.response_status ?? 'pending') as ChecklistResponseStatus);
  const runStatus = deriveRunStatus(statuses);
  const runCompletedAt = runStatus === 'completed' ? toIsoString(new Date()) : null;

  const { data: runRecord, error: runUpdateError } = await supabase
    .from('checklist_runs')
    .update({
      status: runStatus,
      completed_at: runCompletedAt,
    })
    .eq('id', updatedItem.checklist_run_id)
    .select('id, cleaning_job_id')
    .single();

  if (runUpdateError || !runRecord) {
    return { data: null, error: runUpdateError ?? new Error('Checklist run could not be updated.') };
  }

  const { data: jobRuns, error: jobRunsError } = await supabase
    .from('checklist_runs')
    .select('status')
    .eq('cleaning_job_id', runRecord.cleaning_job_id);

  if (jobRunsError) {
    return { data: null, error: jobRunsError };
  }

  const jobStatus = deriveJobStatus((jobRuns ?? []).map((run: any) => run.status as ChecklistRunStatus));
  const now = toIsoString(new Date());

  const nextJobFields: Record<string, string | null> = {
    status: jobStatus,
  };

  if (jobStatus === 'in_progress' || jobStatus === 'blocked' || jobStatus === 'submitted') {
    nextJobFields.started_at = now;
  }

  if (jobStatus === 'submitted') {
    nextJobFields.submitted_at = now;
    nextJobFields.completed_at = now;
  } else {
    nextJobFields.completed_at = null;
  }

  const { error: jobUpdateError } = await supabase
    .from('cleaning_jobs')
    .update(nextJobFields)
    .eq('id', runRecord.cleaning_job_id);

  if (jobUpdateError) {
    return { data: null, error: jobUpdateError };
  }

  return { data: updatedItem, error: null };
}
