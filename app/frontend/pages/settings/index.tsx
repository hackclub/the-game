import { Link, usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import { ACCOUNT_REQUIRED_FIELDS, PrivateUser } from "@/interfaces/user";
import PageHeading from "@/components/layout/PageHeading";

export default function SettingsIndex() {
  const { props } = usePage();
  const missingFields = ACCOUNT_REQUIRED_FIELDS.filter(
    (f) => !props.user[f as keyof PrivateUser],
  );

  return (
    <Layout>
      <PageHeading title="Settings" />

      <div className="flex flex-col gap-4 text-xl p-8 smoothing-black">
        {props.user.role === "admin" && <p>You are an admin.</p>}
        <p>
          <span className="font-bold">Email: </span>
          {props.user.email}
        </p>
        <p>
          <span className="font-bold">Hack Club Account:</span>{" "}
          {props.user.account_id && missingFields.length == 0 ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link
              className={`${props.user.account_id ? "text-yellow-600" : "text-red-500"} underline`}
              href="/auth/hca"
            >
              {props.user.account_id ? "Reauthenticate" : "Click here to link"}
            </Link>
          )}
        </p>
        <MissingAccountFields />
        <p>
          <span className="font-bold">Hackatime:</span>{" "}
          {props.user.hackatime_id ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link className="text-red-500 underline" href="/hackatime/link">
              Click here to link
            </Link>
          )}
        </p>
      </div>
    </Layout>
  );
}
