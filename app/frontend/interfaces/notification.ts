export interface Notification {
  id: number;
  message: string;
  notifiable_type: string;
  notifiable_id: number;
  read: boolean;
  created_at: string;
}
