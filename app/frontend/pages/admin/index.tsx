import Layout from "@/layouts/layout";

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
  return (
    <Layout>
      <div className="px-8">
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="smoothing-black text-4xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 italic">
            absolute power corrupts absolutely...
          </p>
        </div>

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
            href="/admin/orders"
            title="Shop Orders"
            description="View and fulfill shop orders"
          />
        </div>
      </div>
    </Layout>
  );
}
