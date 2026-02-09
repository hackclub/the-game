import ProjectForm from "@/components/projects/ProjectForm";
import Layout from "@/layouts/layout";

import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  hackatime_projects: HackatimeProject[];
  projects_count: number;
}

export default function NewProject({ hackatime_projects }: Props) {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Create a project</h2>
      <div className="flex w-full flex-col gap-2 rounded-md border-2 border-blue-600 bg-blue-100 p-3 md:w-1/3">
        <p>
          It's time to create your first project! A project can be anything you
          make, like websites, games, electronics, and more.
        </p>
        <p>
          You don't need to have a whole plan right now - just enter your
          project's title and a description, and click create!
        </p>
      </div>
      <ProjectForm hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
