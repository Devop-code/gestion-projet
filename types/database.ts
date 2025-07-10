
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'student' | 'supervisor';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  type: 'group_project' | 'internship_report';
  created_by: string;
  supervisor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  student_id: string;
  joined_at: string;
}

export interface TaskList {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_by: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
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
}

export interface SessionReport {
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
}

export interface Note {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
