export interface Order {
  id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  amount_paid: number;
  aasm_state: string;
  created_at: string;
  updated_at: string;
  hold_at: string;
  fulfilled_at: string;
  deleted_at: string;
  pending_at: string;
  note?: string;
  admin_note?: string;
  fulfilled_by?: { id: number; username: string; avatar: string } | null;
}
