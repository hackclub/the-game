// Shipping locked for good when the game ended on July 6th, 2026. Projects
// created before the lock may still be re-shipped, as may projects rejected
// after the lock, so their authors can address the rejection. Must match
// SHIPPING_LOCKED_AT in projects_controller.rb.
const SHIPPING_LOCKED_AT = new Date("2026-07-06T00:00:00Z");

export const SHIPPING_LOCK_MESSAGE =
  "Shipping is locked now that the game has ended. Only projects created before shipping locked, or rejected after, can still be re-shipped.";

export function isShippingLocked(): boolean {
  return new Date() >= SHIPPING_LOCKED_AT;
}

export function isShippingLockedForProject(project: {
  aasm_state: string;
  rejected_at: string | null;
  created_at: string;
}): boolean {
  if (!isShippingLocked()) return false;
  if (new Date(project.created_at) < SHIPPING_LOCKED_AT) {
    return false;
  }
  if (project.aasm_state === "rejected" && project.rejected_at !== null) {
    if (new Date(project.rejected_at) >= SHIPPING_LOCKED_AT) {
      return false;
    }
  }
  return true;
}
