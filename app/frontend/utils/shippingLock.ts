import type { PrivateUser } from "@/interfaces/user";

export function shippingLocked(user: PrivateUser): boolean {
  if (user.is_admin) return false;

  switch (user.shipping_mode) {
    case "all":
      return false;
    case "debt_only":
      return !user.is_debt;
    case "none":
      return true;
  }
}
