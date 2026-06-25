export interface ProjectReview {
  id: number;
  content: string;
  admin_content?: string;
  review_type: string;
  author_id: number;
  created_at: string;
  project_id: number;
  approved_seconds: number;
  pending_hq?: boolean;
  grant_golden_ticket?: boolean;
}
