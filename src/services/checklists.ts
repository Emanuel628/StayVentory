import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

async function ensureRoomChecklistTemplate(input: {
  roomId: string;
  houseId: string;
  roomType: string;
  roomName: string;
}) {
  const supabase = requireSupabase();

  const { data: existingTemplate, error: existingTemplateError } = await supabase
    .from('checklist_templates')
    .select('id, house_id, room_id, room_type, name, created_at')
    .eq('room_id', input.roomId)
    .maybeSingle();

  if (existingTemplateError) {
    return { data: null, error: existingTemplateError };
  }

  if (existingTemplate) {
    return { data: existingTemplate, error: null };
  }

  return supabase
    .from('checklist_templates')
    .insert({
      house_id: input.houseId,
      room_id: input.roomId,
      room_type: input.roomType,
      name: `${input.roomName} standard`,
    })
    .select('id, house_id, room_id, room_type, name, created_at')
    .single();
}

export async function listRoomChecklistTemplate(roomId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('checklist_templates')
    .select(
      `
        id,
        house_id,
        room_id,
        room_type,
        name,
        created_at,
        checklist_template_items (
          id,
          label,
          sort_order,
          required_photo
        )
      `,
    )
    .eq('room_id', roomId)
    .maybeSingle();
}

export async function createRoomChecklistItem(input: {
  roomId: string;
  houseId: string;
  roomType: string;
  roomName: string;
  label: string;
  requiredPhoto: boolean;
}) {
  const templateResult = await ensureRoomChecklistTemplate({
    roomId: input.roomId,
    houseId: input.houseId,
    roomType: input.roomType,
    roomName: input.roomName,
  });

  if (templateResult.error || !templateResult.data) {
    return { data: null, error: templateResult.error ?? new Error('Checklist template could not be created.') };
  }

  const supabase = requireSupabase();

  const { data: lastItem } = await supabase
    .from('checklist_template_items')
    .select('sort_order')
    .eq('template_id', templateResult.data.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  return supabase
    .from('checklist_template_items')
    .insert({
      template_id: templateResult.data.id,
      label: input.label,
      required_photo: input.requiredPhoto,
      sort_order: (lastItem?.sort_order ?? -1) + 1,
    })
    .select('id, label, sort_order, required_photo, template_id')
    .single();
}
