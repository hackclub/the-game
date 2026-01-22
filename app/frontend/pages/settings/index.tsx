import { Link, usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";

export default function SettingsIndex() {
  const { props } = usePage();

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Settings</h1>
      <hr />
      <div className="flex flex-col gap-4 py-3 text-lg">
        {props.user.role === "admin" && <p>You are an admin.</p>}
        <p>
          <span className="font-bold">Email: </span>
          {props.user.email}
        </p>
        <p>
          <span className="font-bold">Hack Club Account:</span>{" "}
          {props.user.account_id ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link className="text-red-500 underline" href="/auth/account_link">
              Click here to link
            </Link>
          )}
        </p>
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
