export interface Project {
  id: number;
  approved: "not_shipped" | "shipped" | null;
  demo_link: string | null;
  desc: string | null;
  hackatime_project_keys: string | null;
  internal_notes: string | null;
  is_deleted: boolean | null;
  project_type: string | null;
  readme_link: string | null;
  repo_link: string | null;
  reported_hours: number | null;
  review_status: "pending" | "approved" | "rejected" | null;
  reviewer_note: string | null;
  shipped: boolean | null;
  submitted_at: string | null;
  title: string | null;
  ysws: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}
