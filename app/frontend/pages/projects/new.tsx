import ProjectForm from "@/components/projects/ProjectForm";
import PageHeading from "@/components/layout/PageHeading";
import Layout from "@/layouts/layout";

import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { ProjectTag } from "@/interfaces/project_tag";

interface Props {
  hackatime_projects: HackatimeProject[];
  projects_count: number;
  tags: ProjectTag[];
}

export default function NewProject({ hackatime_projects, tags }: Props) {
  return (
    <Layout>
      <PageHeading eyebrow="Projects" title="Create new project" />
      <div className="mt-8">
        <ProjectForm
          hackatime_projects={hackatime_projects}
          tags={tags}
          tutorial={true}
        />
      </div>
    </Layout>
  );
}
