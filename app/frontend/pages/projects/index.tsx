import Layout from "@/layouts/layout";
import ProjectList from "@/components/projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <h2 className="mb-1 text-3xl font-bold">Your projects</h2>
      <p className="mb-2">
        read our{" "}
        <a
          className="text-blue-500 underline"
          href="https://hack.club/hctg-submission-guide"
        >
          project submission guide
        </a>{" "}
        before starting and submitting your projects!
      </p>

      <ProjectList projects={projects} />
    </Layout>
  );
}
