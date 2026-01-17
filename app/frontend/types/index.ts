import type { User } from "@/interfaces/user";

export type Flash = {
  notice?: string;
  alert?: string;
};

export type SharedProps = {
  flash: Flash;
  user: User;
};
