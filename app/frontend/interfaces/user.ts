export interface PrivateUser {
  id: number;
  avatar: string;
  email: string;
  role: string;
  username: string;
  ysws_verified: boolean;
  account_id: string;
  hackatime_id: string;
  slack_id: string;
}

export interface PublicUser {
  id: number;
  avatar: string;
  email: string;
  role: string;
  username: string;
}
