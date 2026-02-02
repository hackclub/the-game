import type { PrivateUser } from "@/interfaces/user";

export type Flash = {
  notice?: string;
  alert?: string;
};

export type SharedProps = {
  flash: Flash;
  user: PrivateUser;
};
