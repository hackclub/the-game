import ProjectForm from "@/components/projects/ProjectForm";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  project: Project;
  hackatime_projects: HackatimeProject[];
}

export default function EditProject({ project, hackatime_projects }: Props) {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Edit project</h2>
      <ProjectForm project={project} hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
