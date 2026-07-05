export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      attachments: {
        Row: {
          created_at: string;
          file_path: string;
          house_id: string | null;
          id: string;
          issue_id: string | null;
          note_id: string | null;
          room_id: string | null;
          uploaded_by_user_id: string;
        };
        Insert: {
          created_at?: string;
          file_path: string;
          house_id?: string | null;
          id?: string;
          issue_id?: string | null;
          note_id?: string | null;
          room_id?: string | null;
          uploaded_by_user_id: string;
        };
        Update: Partial<Database['public']['Tables']['attachments']['Insert']>;
      };
      checklist_run_items: {
        Row: {
          checklist_run_id: string;
          completed_at: string | null;
          id: string;
          note: string | null;
          photo_count: number;
          photo_required: boolean;
          response_status: Database['public']['Enums']['checklist_response_status'] | null;
          template_item_id: string;
        };
        Insert: {
          checklist_run_id: string;
          completed_at?: string | null;
          id?: string;
          note?: string | null;
          photo_count?: number;
          photo_required?: boolean;
          response_status?: Database['public']['Enums']['checklist_response_status'] | null;
          template_item_id: string;
        };
        Update: Partial<Database['public']['Tables']['checklist_run_items']['Insert']>;
      };
      checklist_runs: {
        Row: {
          cleaning_job_id: string;
          completed_at: string | null;
          id: string;
          room_id: string;
          status: Database['public']['Enums']['checklist_run_status'];
        };
        Insert: {
          cleaning_job_id: string;
          completed_at?: string | null;
          id?: string;
          room_id: string;
          status?: Database['public']['Enums']['checklist_run_status'];
        };
        Update: Partial<Database['public']['Tables']['checklist_runs']['Insert']>;
      };
      checklist_template_items: {
        Row: {
          id: string;
          label: string;
          required_photo: boolean;
          sort_order: number;
          template_id: string;
        };
        Insert: {
          id?: string;
          label: string;
          required_photo?: boolean;
          sort_order?: number;
          template_id: string;
        };
        Update: Partial<Database['public']['Tables']['checklist_template_items']['Insert']>;
      };
      checklist_templates: {
        Row: {
          created_at: string;
          house_id: string;
          id: string;
          name: string;
          room_id: string | null;
          room_type: string;
        };
        Insert: {
          created_at?: string;
          house_id: string;
          id?: string;
          name: string;
          room_id?: string | null;
          room_type: string;
        };
        Update: Partial<Database['public']['Tables']['checklist_templates']['Insert']>;
      };
      cleaning_jobs: {
        Row: {
          assigned_user_id: string | null;
          cleaner_note: string | null;
          completed_at: string | null;
          created_at: string;
          house_id: string;
          id: string;
          owner_note: string | null;
          reviewed_at: string | null;
          scheduled_for: string;
          started_at: string | null;
          status: Database['public']['Enums']['cleaning_job_status'];
          submitted_at: string | null;
        };
        Insert: {
          assigned_user_id?: string | null;
          cleaner_note?: string | null;
          completed_at?: string | null;
          created_at?: string;
          house_id: string;
          id?: string;
          owner_note?: string | null;
          reviewed_at?: string | null;
          scheduled_for: string;
          started_at?: string | null;
          status?: Database['public']['Enums']['cleaning_job_status'];
          submitted_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['cleaning_jobs']['Insert']>;
      };
      house_members: {
        Row: {
          can_manage_access: boolean;
          created_at: string;
          house_id: string;
          id: string;
          invite_code: string | null;
          invited_by_user_id: string;
          member_user_id: string;
          status: Database['public']['Enums']['membership_status'];
        };
        Insert: {
          can_manage_access?: boolean;
          created_at?: string;
          house_id: string;
          id?: string;
          invite_code?: string | null;
          invited_by_user_id: string;
          member_user_id: string;
          status?: Database['public']['Enums']['membership_status'];
        };
        Update: Partial<Database['public']['Tables']['house_members']['Insert']>;
      };
      house_playbooks: {
        Row: {
          body: string;
          created_at: string;
          house_id: string;
          id: string;
          section: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          house_id: string;
          id?: string;
          section: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['house_playbooks']['Insert']>;
      };
      houses: {
        Row: {
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          country: string;
          created_at: string;
          id: string;
          name: string;
          owner_user_id: string;
          postal_code: string;
          state: string;
        };
        Insert: {
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          country?: string;
          created_at?: string;
          id?: string;
          name: string;
          owner_user_id: string;
          postal_code: string;
          state: string;
        };
        Update: Partial<Database['public']['Tables']['houses']['Insert']>;
      };
      inventory_items: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          tracks_quantity: boolean;
          unit_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          tracks_quantity?: boolean;
          unit_type: string;
        };
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>;
      };
      issues: {
        Row: {
          category: Database['public']['Enums']['issue_category'];
          cleaning_job_id: string | null;
          created_at: string;
          description: string;
          house_id: string;
          id: string;
          priority: Database['public']['Enums']['issue_priority'];
          reported_by_user_id: string;
          requires_owner_review: boolean;
          resolution_notes: string | null;
          resolved_at: string | null;
          room_id: string | null;
          status: Database['public']['Enums']['issue_status'];
          title: string;
        };
        Insert: {
          category: Database['public']['Enums']['issue_category'];
          cleaning_job_id?: string | null;
          created_at?: string;
          description: string;
          house_id: string;
          id?: string;
          priority?: Database['public']['Enums']['issue_priority'];
          reported_by_user_id: string;
          requires_owner_review?: boolean;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          room_id?: string | null;
          status?: Database['public']['Enums']['issue_status'];
          title: string;
        };
        Update: Partial<Database['public']['Tables']['issues']['Insert']>;
      };
      notes: {
        Row: {
          audience: Database['public']['Enums']['note_audience'];
          author_user_id: string;
          body: string;
          cleaning_job_id: string | null;
          created_at: string;
          house_id: string | null;
          id: string;
          issue_id: string | null;
          note_type: Database['public']['Enums']['note_type'];
          room_id: string | null;
        };
        Insert: {
          audience?: Database['public']['Enums']['note_audience'];
          author_user_id: string;
          body: string;
          cleaning_job_id?: string | null;
          created_at?: string;
          house_id?: string | null;
          id?: string;
          issue_id?: string | null;
          note_type?: Database['public']['Enums']['note_type'];
          room_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['notes']['Insert']>;
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          email: string | null;
          id: string;
          phone: string | null;
          role: Database['public']['Enums']['app_role'];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id: string;
          phone?: string | null;
          role: Database['public']['Enums']['app_role'];
          updated_at?: string;
          username?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      room_inventory_items: {
        Row: {
          created_at: string;
          current_quantity: number | null;
          description: string | null;
          display_order: number;
          id: string;
          inventory_item_id: string;
          maximum_quantity: number;
          minimum_quantity: number;
          required_for_ready: boolean;
          room_id: string;
          status: Database['public']['Enums']['inventory_status'];
          storage_location_note: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_quantity?: number | null;
          description?: string | null;
          display_order?: number;
          id?: string;
          inventory_item_id: string;
          maximum_quantity?: number;
          minimum_quantity?: number;
          required_for_ready?: boolean;
          room_id: string;
          status?: Database['public']['Enums']['inventory_status'];
          storage_location_note?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['room_inventory_items']['Insert']>;
      };
      rooms: {
        Row: {
          created_at: string;
          house_id: string;
          icon_key: string | null;
          id: string;
          instructions: string | null;
          name: string;
          room_type: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          house_id: string;
          icon_key?: string | null;
          id?: string;
          instructions?: string | null;
          name: string;
          room_type: string;
          sort_order?: number;
        };
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ensure_my_profile: {
        Args: {
          profile_role: Database['public']['Enums']['app_role'];
          profile_email?: string | null;
          profile_display_name?: string | null;
          profile_username?: string | null;
        };
        Returns: Database['public']['Tables']['profiles']['Row'];
      };
      email_exists_for_signup: {
        Args: { target_email: string };
        Returns: boolean;
      };
      current_app_role: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['Enums']['app_role'] | null;
      };
      user_can_access_house: {
        Args: { target_house_id: string };
        Returns: boolean;
      };
      user_owns_house: {
        Args: { target_house_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'owner' | 'cleaner';
      checklist_response_status:
        | 'pending'
        | 'cleaned'
        | 'restocked'
        | 'needs_attention'
        | 'item_missing'
        | 'damage_found';
      checklist_run_status: 'pending' | 'in_progress' | 'completed' | 'blocked';
      cleaning_job_status: 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';
      inventory_status: 'ready' | 'low_stock' | 'missing' | 'needs_attention';
      issue_category: 'repair' | 'maintenance' | 'replace';
      issue_priority: 'low' | 'medium' | 'high' | 'urgent';
      issue_status: 'open' | 'reviewing' | 'resolved';
      membership_status: 'active' | 'revoked';
      note_audience: 'owner' | 'cleaner' | 'shared';
      note_type: 'general' | 'instruction' | 'turnover' | 'issue';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
