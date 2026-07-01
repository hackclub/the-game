import Layout from "@/layouts/layout";
import { Link, usePage } from "@inertiajs/react";
import type { PrivateUser } from "@/interfaces/user";

interface QuickStats {
  total_users: number;
  active_today: number;
  active_this_week: number;
  total_projects: number;
  projects_submitted: number;
  projects_approved: number;
  pending_orders: number;
  shipped_users: number;
  review_queue: number;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white px-4 py-3">
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-900 tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
      {children}
    </h2>
  );
}

function NavCard({
  href,
  title,
  description,
  badge,
  external,
}: {
  href: string;
  title: string;
  description: string;
  badge?: number;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="ml-3 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
          {badge}
        </span>
      )}
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

export default function AdminPage() {
  const { user, quick_stats } = usePage<{
    user: PrivateUser;
    quick_stats: QuickStats;
  }>().props;

  const isAdmin = user.is_admin;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Admin Dashboard" : "Fulfillment"}
          </h1>

          {isAdmin && (
            <div className="flex gap-2">
              <a
                href="/blazer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <span className="text-base">&#x2318;</span>
                Blazer
              </a>
              <a
                href="https://plausible.io/hctg.hackclub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <span className="text-base">&#x2197;</span>
                Plausible
              </a>
            </div>
          )}
        </div>

        {isAdmin && quick_stats && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="DAU" value={quick_stats.active_today} />
            <StatCard label="WAU" value={quick_stats.active_this_week} />
            <StatCard label="Total Users" value={quick_stats.total_users} />
            <StatCard label="Approved" value={quick_stats.projects_approved} />
            <StatCard label="Review Queue" value={quick_stats.review_queue} />
            <StatCard
              label="Pending Orders"
              value={quick_stats.pending_orders}
            />
          </div>
        )}

        {isAdmin && (
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <SectionHeading>Content</SectionHeading>
              <div className="flex flex-col gap-2">
                <NavCard
                  href="/admin/announcements"
                  title="Announcements"
                  description="Create and manage announcements"
                />
                <NavCard
                  href="/admin/stats"
                  title="Stats"
                  description="User funnel, numbers, and more"
                />
                <NavCard
                  href="/admin/tags"
                  title="Project Tags"
                  description="Create, delete, and modify project tags"
                />
                <NavCard
                  href="/admin/referrals"
                  title="Referral Program"
                  description="Manage referral rollout, settings, and stats"
                />
                <NavCard
                  href="/admin/goals"
                  title="Homepage Goals"
                  description="Set shop items tracked as goals on the homepage"
                />
              </div>
            </div>

            <div>
              <SectionHeading>Data</SectionHeading>
              <div className="flex flex-col gap-2">
                <NavCard
                  href="/admin/projects"
                  title="Projects"
                  description="Manage published projects"
                />
                <NavCard
                  href="/admin/users"
                  title="Users"
                  description="View all users"
                />
                <NavCard
                  href="/admin/items"
                  title="Shop Items"
                  description="Create, delete, and modify shop items"
                />
                <NavCard
                  href="/admin/audit-log"
                  title="Audit Log"
                  description="Browse paper trail records across models"
                />
              </div>
            </div>
          </div>
        )}

        <div
          className={`mb-6 grid grid-cols-1 gap-6 ${isAdmin ? "md:grid-cols-2" : ""}`}
        >
          <div>
            <SectionHeading>Fulfillment</SectionHeading>
            <div className="flex flex-col gap-2">
              <NavCard
                href="/admin/orders"
                title="Shop Orders"
                description="View and fulfill shop orders"
              />
              <NavCard
                href="/admin/ticket_transfers"
                title="Ticket Transfers"
                description="View and approve/reject ticket transfers"
              />
              <NavCard
                href="/admin/grants"
                title="Grants"
                description="Export grant CSVs for pending orders"
              />
              <NavCard
                href="/admin/budget"
                title="Budget Overview"
                description="Shop costs, user balances, and total spend"
              />
            </div>
          </div>

          {isAdmin && (
            <div>
              <SectionHeading>Reviews</SectionHeading>
              <div className="flex flex-col gap-2">
                <NavCard
                  href="/review"
                  title="Review Queue"
                  description="Review submitted projects"
                  badge={quick_stats?.review_queue}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
