import ProjectEdit from "@/components/Projects/ProjectEdit";
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
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Edit your Project{" "}
      </h1>
      <ProjectEdit project={project} hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
