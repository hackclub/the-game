export interface PrivateUser {
  id: number;
  first_name: string;
  last_name: string;
  github_username: string;
  balance: number;

  address_street: string;
  address_locality: string;
  address_region: string;
  address_country: string;
  address_postal: string;

  birthday: string;
  avatar: string;
  email: string;
  role: string;
  username: string;
  ysws_verified: boolean;
  account_id: string;
  hackatime_id: string;
  slack_id: string;
  onboarding_completed: boolean;
  project_count?: number;
  verification_status: string;
}

export interface ReviewerUser {
  id: number;
  avatar: string;
  role: string;
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
