// EDT is UTC-4
const SHIPPING_PAUSE_START = new Date("2026-05-10T21:02:00Z");
const SHIPPING_RESUME = new Date("2026-05-11T21:00:00Z");
const REJECTION_EXCEPTION_START = new Date(
  SHIPPING_PAUSE_START.getTime() - 2 * 24 * 60 * 60 * 1000,
);

export const SHIPPING_PAUSE_MESSAGE =
  "Shipping is temporarily paused as reviewers work to review projects of people who are qualifying for the HCTG event. It will be unpaused at 5:00pm ET on May 11th, 2026.";

export function isShippingPaused(): boolean {
  const now = new Date();
  return now >= SHIPPING_PAUSE_START && now < SHIPPING_RESUME;
}

export function isShippingPausedForProject(project: {
  aasm_state: string;
  rejected_at: string | null;
}): boolean {
  if (!isShippingPaused()) return false;
  if (
    project.aasm_state === "rejected" &&
    project.rejected_at !== null
  ) {
    const rejectedAt = new Date(project.rejected_at);
    if (
      rejectedAt >= REJECTION_EXCEPTION_START &&
      rejectedAt < SHIPPING_PAUSE_START
    ) {
      return false;
    }
  }
  return true;
}
