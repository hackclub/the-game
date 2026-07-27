import Layout from "@/layouts/layout";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ProjectList from "@/components/projects/ProjectList";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/types";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  const { props } = usePage<SharedProps>();
  // Since the game ended, only debt-role users (working off their debt) and
  // admins can create new projects. Shipping existing ones is open to all.
  const canCreate = props.user.is_admin || props.user.is_debt;

  return (
    <Layout>
      <PageHeading
        title="Projects"
        subtitle="Build a brand new project, or continue working on an existing one! The hours you put in your project will count towards qualifying for the event and buying stuff in the shop."
      />
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        {!canCreate && (
          <div className="rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-800">
            <span className="text-xl font-bold">The game has ended</span>
            <p className="mt-1 text-lg">
              New projects can no longer be created, but you can still ship or
              re-ship your existing projects below.
            </p>
          </div>
        )}

        <ProjectList projects={projects} canCreate={canCreate} />
      </div>
    </Layout>
  );
}
