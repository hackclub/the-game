export interface Order {
  id: number;
  user_id: number;
  item_id: number;
  aasm_state: string;
  created_at: string;
  updated_at: string;
  hold_at: string;
  fulfilled_at: string;
  pending_at: string;
}
