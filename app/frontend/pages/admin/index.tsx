import Layout from "@/layouts/layout";
import { usePage } from "@inertiajs/react";
import type { PrivateUser } from "@/interfaces/user";

function AdminNav({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      role="button"
      href={href}
      className="flex flex-col rounded-lg bg-[#FECA11] p-6 shadow-md transition-transform hover:scale-105"
    >
      <span className="font-bold">{title}</span>
      <span>{description}</span>
    </a>
  );
}

export default function AdminPage() {
  const { user } = usePage<{ user: PrivateUser }>().props;
  const isAdmin = user.role === "admin";

  return (
    <Layout>
      <div className="px-8">
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="smoothing-black text-4xl font-bold">
            {isAdmin ? "Admin Dashboard" : "Fulfillment"}
          </h1>
          <p className="text-gray-500 italic">
            {isAdmin
              ? "absolute power corrupts absolutely..."
              : "stuff for fulfilling :p"}
          </p>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AdminNav
              href="/blazer"
              title="Blazer"
              description="Dashboards, charts, SQL"
            />
            <AdminNav
              href="/admin/announcements"
              title="Announcements"
              description="Create announcements"
            />
            <AdminNav
              href="/admin/stats"
              title="Stats"
              description="User funnel, numbers, and more"
            />
            <AdminNav
              href="https://plausible.io/hctg.hackclub.com"
              title="Plausible"
              description="Privacy-friendly analytics"
            />
            <AdminNav
              href="/admin/projects"
              title="Projects"
              description="Manage published projects"
            />
            <AdminNav
              href="/admin/users"
              title="Users"
              description="View all users"
            />
            <AdminNav
              href="/admin/items"
              title="Shop Items"
              description="Create/delete/modify items in the shop"
            />
            <AdminNav
              href="/admin/tags"
              title="Project Tags"
              description="Create/delete/modify project tags"
            />
            <AdminNav
              href="/admin/referrals"
              title="Referral Program"
              description="Manage referral rollout, settings, and stats"
            />
            <AdminNav
              href="/invite"
              title="Invite Page"
              description="Og referral page"
            />
            <AdminNav
              href="/admin/audit-log"
              title="Audit Log"
              description="Browse all paper trail records across models"
            />
          </div>
        )}

        {isAdmin && (
          <div className="mt-8 mb-4 flex flex-col gap-1">
            <h2 className="smoothing-black text-2xl font-bold">Fulfillment</h2>
            <p className="text-gray-500 italic">stuff for fulfilling :p</p>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${isAdmin ? "" : "mt-4"}`}
        >
          <AdminNav
            href="/admin/orders"
            title="Shop Orders"
            description="View and fulfill shop orders"
          />
          <AdminNav
            href="/admin/ticket_transfers"
            title="Ticket Transfers"
            description="View and approve/reject ticket transfers"
          />
          <AdminNav
            href="/admin/grants"
            title="Grants"
            description="Export grant CSVs for pending orders"
          />
        </div>
      </div>
    </Layout>
  );
}
