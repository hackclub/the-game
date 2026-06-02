import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import TestProjectCard from "@/components/projects/TestProjectCard";
import { usePage } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";

interface PageUser {
  id: number;
  username: string | null;
  avatar: string | null;
  role: string;
}

export default function UserDisplayPage({
  page_user,
  projects,
}: {
  page_user: PageUser;
  projects: (Project & { username: string })[];
}) {
  const { user } = usePage<{ user?: { role: string } }>().props;
  const isAdmin = user?.role === "admin";

  return (
    <Layout>
      <PageHeading title={page_user.username ?? `User #${page_user.id}`} />

      <div className="mt-4 flex items-center gap-4 pl-8">
        {page_user.avatar && (
          <img
            src={page_user.avatar}
            alt={page_user.username ?? "Avatar"}
            className="h-16 w-16 rounded-full border-2 border-black"
          />
        )}
        <div>
          <p className="smoothing-black text-2xl tracking-[-0.02em]">
            {projects.length} Project{projects.length === 1 ? "" : "s"}!
          </p>
        </div>
      </div>

      <div className="mt-8 pl-8">
        {projects.length === 0 ? (
          <p className="smoothing-gray text-xl text-gray-600">
            No projects yet, check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <TestProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8 pl-8">
          <a
            href={`/admin/users/${page_user.id}`}
            className="inline-block rounded-xl border-2 border-black bg-white px-4 py-3 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
          >
            Admin View
          </a>
        </div>
      )}
    </Layout>
  );
}
