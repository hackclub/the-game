import { Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";

export default function SettingsIndex(user: {
  email: string;
  hca_linked: boolean;
  hackatime_linked: boolean;
  admin: boolean;
}) {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Settings</h1>
      <hr />
      <div className="flex flex-col gap-4 py-3 text-lg">
        {user.admin && <p>You are an admin.</p>}
        <p>
          <span className="font-bold">Email: </span>
          {user.email}
        </p>
        <p>
          <span className="font-bold">Hack Club Account:</span>{" "}
          {user.hca_linked ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link className="text-red-500 underline" href="/auth/account_link">
              Click here to link
            </Link>
          )}
        </p>
        <p>
          <span className="font-bold">Hackatime:</span>{" "}
          {user.hackatime_linked ? (
            <span className="text-green-600">Linked</span>
          ) : (
            <Link
              className="text-red-500 underline"
              href="/auth/hackatime_link"
            >
              Click here to link
            </Link>
          )}
        </p>
      </div>
    </Layout>
  );
}
