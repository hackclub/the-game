import ProjectCreate from "@/components/Projects/ProjectCreate";
import Layout from "@/layouts/layout";

import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  hackatime_projects: HackatimeProject[];
}

export default function NewProject({ hackatime_projects }: Props) {
  return (
    <Layout>
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Make your first project!
      </h1>
      <ProjectCreate hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
