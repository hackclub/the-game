export interface Statistic {
  date: string;
  approved_hours: number;
  project_count: number;
  user_count: number;
  user_onboarding_count: number;
  user_slack_count: number;
  user_account_count: number;
  user_hackatime_count: number;
  user_idv_verified_count: number;
  user_project_created_count: number;
  user_project_submitted_count: number;
  user_project_shipped_count: number;
}

export interface OrderEntry {
  date: string;
  count: number;
}
