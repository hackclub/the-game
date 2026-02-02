import Layout from "@/layouts/layout";

export default function AdminPage() {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href="/blazer"
          className="block rounded-lg bg-red-300 p-6 shadow-md transition-colors hover:bg-red-200"
        >
          Blazer
        </a>
        <a
          href="/admin/announcements/"
          className="block rounded-lg bg-red-300 p-6 shadow-md transition-colors hover:bg-red-200"
        >
          Announcements
        </a>
        <a
          href="https://plausible.io/hctg.hackclub.com"
          className="block rounded-lg bg-red-300 p-6 shadow-md transition-colors hover:bg-red-200"
        >
          Plausible Analytics
        </a>
        <a
          href="/admin/projects"
          className="block rounded-lg bg-red-300 p-6 shadow-md transition-colors hover:bg-red-200"
        >
          Projects
        </a>
      </div>
    </Layout>
  );
}
