import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/interfaces/project";

export default function ExplorePage({
  projects,
}: {
  projects: (Project & { username: string })[];
}) {
  return (
    <Layout>
      <PageHeading
        title="Gallery"
        subtitle="Take a look at all of the cool projects submitted to Hack Club: The Game!"
      />
      <div className="mt-8 pl-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
