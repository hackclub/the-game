export interface ProjectReview {
  id: number;
  content: string;
  admin_content?: string;
  review_type: string;
  author_id: number;
  created_at: string;
  project_id: number;
  approved_seconds: number;
  grant_golden_ticket?: boolean;
  // Set on a held community approval (a Project::PendingApproval surfaced through
  // the same shape as a review) so the UI can route edits/authorization correctly.
  is_pending_approval?: boolean;
}
