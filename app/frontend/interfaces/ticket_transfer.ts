export interface TicketTransfer {
  id: number;
  from_user_name: string;
  to_user_name: string;
  amount: number;
  reason: string;
  created_at: string;
}
