import { ACCOUNT_REQUIRED_FIELDS } from "@/interfaces/user";
import { usePage } from "@inertiajs/react";
import { PrivateUser } from "@/interfaces/user";
import { humanize } from "@/utils/humanize";

export default function MissingAccountFields() {
  const { props } = usePage();
  const missingFields = ACCOUNT_REQUIRED_FIELDS.filter(
    (f) => !props.user[f as keyof PrivateUser],
  );

  return (
    <>
      {missingFields.length > 0 ? (
        <div className="rounded-md border border-black bg-red-700 p-3 text-lg text-white">
          <p>Your profile is missing the following information:</p>
          <ul className="list-disc">
            {missingFields.map((f) => (
              <li className="ml-5">{humanize(f)}</li>
            ))}
          </ul>
          <p>
            Make sure you have this data saved in Hack Club Account and{" "}
            <a href="/auth/hca" className="underline">
              reauthenticate
            </a>{" "}
            to fix!
          </p>
        </div>
      ) : null}
    </>
  );
}
