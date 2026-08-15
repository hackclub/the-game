export interface TicketAdjustment {
  id: number;
  amount: number;
  reason: string;
  created_at: string;
  created_by?: { id: number; username: string; avatar: string } | null;
}
