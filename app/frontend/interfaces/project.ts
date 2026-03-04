export interface Project {
  id: number;
  aasm_state: string;
  status: string;
  demo_link: string | null;
  desc: string | null;
  hackatime_projects: number[];
  project_type: string | null;
  repo_link: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  title: string | null;
  ysws: string | null;
  created_at: string;
  updated_at: string;
  total_seconds: number;
  reported_seconds: number;
  user_id: number;
  screenshot: string;
  approved_seconds: number;
  real_approved_seconds: number;
  high_quality: boolean;
  unread_notification_count: number;
}
