import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import TestProjectCard from "@/components/projects/TestProjectCard";
import type { Project } from "@/interfaces/project";

export default function TestProjectPage({
  projects,
}: {
  projects: (Project & { username: string })[];
}) {
  return (
    <Layout>
      <PageHeading
        title="Test · Project Card"
        subtitle="If you aren't an admin how the helly did you find this page"
      />

      <div className="mt-8 pl-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <TestProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
