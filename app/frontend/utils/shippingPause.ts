// EDT is UTC-4
const SHIPPING_PAUSE_START = new Date("2026-05-10T21:02:00Z");
const SHIPPING_RESUME = new Date("2026-05-11T21:00:00Z");

export const SHIPPING_PAUSE_MESSAGE =
  "Shipping is temporarily paused as reviewers work to review projects of people who are qualifying for the HCTG event. It will be unpaused at 5:00pm ET on May 11th, 2026.";

export function isShippingPaused(): boolean {
  const now = new Date();
  return now >= SHIPPING_PAUSE_START && now < SHIPPING_RESUME;
}
