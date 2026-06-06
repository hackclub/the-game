import type { TicketAdjustment } from "./ticket_adjustment";
import type { TicketTransfer } from "./ticket_transfer";

export interface PrivateUser {
  id: number;
  first_name: string;
  last_name: string;
  github_username: string;
  balance: number;
  total_reported_seconds: number;
  total_in_review_seconds: number;
  total_approved_seconds: number;

  address_street: string;
  address_locality: string;
  address_region: string;
  address_country: string;
  address_postal: string;

  birthday: string;
  avatar: string;
  email: string;
  role: string;
  is_reviewer: boolean;
  is_fulfiller: boolean;
  username: string;
  ysws_verified: boolean;
  account_id: string;
  hackatime_id: string;
  slack_id: string;
  onboarding_completed: boolean;
  project_count?: number;
  verification_status: string;

  unread_notification_count: number;
  unread_project_notification_count: number;
  referral_program_active: boolean;

  ticket_adjustments: TicketAdjustment[];
  incoming_ticket_transfers: TicketTransfer[];
  outgoing_ticket_transfers: TicketTransfer[];
  wizard: boolean;
  can_overspend: boolean;
}

export interface ReviewerUser {
  id: number;
  avatar: string;
  role: string;
  is_reviewer: boolean;
  is_fulfiller: boolean;
  username: string;

  email: string;
  hackatime_id: string;
  slack_id: string;
  verification_status: string;
}

export interface PublicUser {
  id: number;
  avatar: string;
  role: string;
  is_reviewer: boolean;
  is_fulfiller: boolean;
  username: string;
}

export const ACCOUNT_REQUIRED_FIELDS = [
  // "first_name",
  // "last_name",
  // "address_street",
  // "address_locality",
  // "address_region",
  // "address_country",
  // "address_postal",
  // "birthday",
];
