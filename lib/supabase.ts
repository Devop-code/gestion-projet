
import { createClient } from '@supabase/supabase-js';
import type { Database as GeneratedDatabase } from '@/integrations/supabase/types';

// Custom database interface that matches our actual schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'student' | 'supervisor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'student' | 'supervisor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'student' | 'supervisor';
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'group_project' | 'internship_report';
          created_by: string;
          supervisor_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: 'group_project' | 'internship_report';
          created_by: string;
          supervisor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: 'group_project' | 'internship_report';
          created_by?: string;
          supervisor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          student_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          student_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          student_id?: string;
          joined_at?: string;
        };
      };
      task_lists: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          created_by: string;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          created_by: string;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          task_list_id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'completed';
          assigned_to: string | null;
          created_by: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_list_id: string;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          assigned_to?: string | null;
          created_by: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          task_list_id?: string;
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          assigned_to?: string | null;
          created_by?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      session_reports: {
        Row: {
          id: string;
          project_id: string;
          author_id: string;
          title: string;
          content: string;
          session_date: string;
          is_validated: boolean;
          validated_by: string | null;
          validated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          author_id: string;
          title: string;
          content: string;
          session_date: string;
          is_validated?: boolean;
          validated_by?: string | null;
          validated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          session_date?: string;
          is_validated?: boolean;
          validated_by?: string | null;
          validated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          project_id: string;
          author_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          author_id: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

const SUPABASE_URL = "https://yrzfikejvjinrgilozkr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyemZpa2VqdmppbnJnaWxvemtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzY0NDAsImV4cCI6MjA2NzE1MjQ0MH0.WW3PSPrG7BjLsLoGRMG34eeIt5A_XZIRv3LiW8W5w9s";

// Create a properly typed Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
