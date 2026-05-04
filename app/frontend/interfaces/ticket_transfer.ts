export interface TicketTransfer {
  id: number;
  from_user_id?: number;
  to_user_id?: number;
  from_user_name: string;
  to_user_name: string;
  amount: number;
  reason: string;
  aasm_state: string;
  created_at: string;
  approved_at: string;
  rejected_at: string;
}
