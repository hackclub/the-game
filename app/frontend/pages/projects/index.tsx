import Layout from "@/layouts/layout";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ProjectList from "@/components/projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <PageHeading
        title="Projects"
        subtitle="Build a brand new project, or continue working on an existing one! The hours you put in your project will count towards qualifying for the event and buying stuff in the shop."
      />
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        <ProjectList projects={projects} />
      </div>
    </Layout>
  );
}
