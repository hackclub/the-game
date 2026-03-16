import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/types";

const IDV_VERIFICATION_URL =
  "https://auth.hackclub.com/verifications/document";

export default function IdvVerificationAlert() {
  const { props } = usePage<SharedProps>();

  if (props.user.verification_status === "verified") {
    return null;
  }

  return (
    <a
      href={IDV_VERIFICATION_URL}
      className="flex flex-col gap-1 rounded-xl bg-[#fecb0d] p-8 text-black transition-transform hover:scale-[101%] active:scale-[99%]"
    >
      <span className="text-3xl font-bold">You aren't verified!</span>
      <span className="text-xl">
        Verify your identity to be able to buy items from the shop and get your
        projects reviewed.
      </span>
    </a>
  );
}
