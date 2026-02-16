export interface ProjectReview {
  id: number;
  content: string;
  review_type: string;
  author_id: number;
  admin_only: boolean;
}
