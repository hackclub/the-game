import Layout from "@/layouts/layout";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ProjectList from "@/components/projects/ProjectList";
import {
  isShippingLocked,
  isShippingLockedForProject,
  SHIPPING_LOCK_MESSAGE,
} from "@/utils/shippingLock";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/types";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  const { props } = usePage<SharedProps>();
  const isAdmin = props.user.is_admin;
  const allLocked =
    !isAdmin &&
    isShippingLocked() &&
    projects.every((p) => isShippingLockedForProject(p));

  return (
    <Layout>
      <PageHeading
        title="Projects"
        subtitle="Build a brand new project, or continue working on an existing one! The hours you put in your project will count towards qualifying for the event and buying stuff in the shop."
      />
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        {allLocked && (
          <div className="rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-800">
            <span className="text-xl font-bold">Shipping locked</span>
            <p className="mt-1 text-lg">{SHIPPING_LOCK_MESSAGE}</p>
          </div>
        )}

        <ProjectList projects={projects} />
      </div>
    </Layout>
  );
}
