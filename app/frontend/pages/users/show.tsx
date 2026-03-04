import { Link, usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import { ACCOUNT_REQUIRED_FIELDS, PrivateUser } from "@/interfaces/user";
import PageHeading from "@/components/layout/PageHeading";

interface Props {
  page_user: PrivateUser;
  custom: boolean;
  [_: string]: unknown;
}

export default function UserPage() {
  const { props } = usePage<Props>();
  const missingFields = ACCOUNT_REQUIRED_FIELDS.filter(
    (f) => !props.page_user[f as keyof PrivateUser],
  );

  return (
    <Layout>
      <PageHeading
        title={props.custom ? props.page_user.username : "Settings"}
      />

      <div className="smoothing-black flex flex-col gap-4 p-8 text-xl">
        {props.page_user.role === "admin" && <p>You are an admin.</p>}
        {props.page_user.role === "reviewer" && <p>You are a reviewer.</p>}
        <p>
          <span className="font-bold">Email: </span>
          {props.page_user.email}
        </p>
        <p>
          <span className="font-bold">Hack Club Account:</span>{" "}
          {props.page_user.account_id && missingFields.length == 0 ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link
              className={`${props.page_user.account_id ? "text-yellow-600" : "text-red-500"} underline`}
              href="/auth/hca"
            >
              {props.page_user.account_id
                ? "Reauthenticate"
                : "Click here to link"}
            </Link>
          )}
        </p>
        <MissingAccountFields />
        <p>
          <span className="font-bold">Hackatime:</span>{" "}
          {props.page_user.hackatime_id ? (
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
