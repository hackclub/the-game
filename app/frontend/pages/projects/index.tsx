import Layout from "@/layouts/layout";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ProjectList from "@/components/projects/ProjectList";
import { isShippingPaused, isShippingPausedForProject, SHIPPING_PAUSE_MESSAGE } from "@/utils/shippingPause";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  const allPaused =
    isShippingPaused() && projects.every((p) => isShippingPausedForProject(p));

  return (
    <Layout>
      <PageHeading
        title="Projects"
        subtitle="Build a brand new project, or continue working on an existing one! The hours you put in your project will count towards qualifying for the event and buying stuff in the shop."
      />
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        {allPaused && (
          <div className="rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-800">
            <span className="text-xl font-bold">Shipping paused</span>
            <p className="mt-1 text-lg">{SHIPPING_PAUSE_MESSAGE}</p>
          </div>
        )}

        <ProjectList projects={projects} />
      </div>
    </Layout>
  );
}
