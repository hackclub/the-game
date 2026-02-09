import Layout from "@/layouts/layout";
import ProjectList from "@/components/projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <h2 className="mb-1 text-3xl font-bold">Your projects</h2>
      <div className="mb-2 flex w-full flex-col gap-2 rounded-md border-2 border-blue-600 bg-blue-100 p-3 md:w-1/2">
        <p>
          Read our{" "}
          <a
            className="text-blue-500 underline"
            href="https://hack.club/hctg-submission-guide"
          >
            project submission guide
          </a>{" "}
          before starting and submitting your projects!
        </p>
      </div>

      <ProjectList projects={projects} />
    </Layout>
  );
}
