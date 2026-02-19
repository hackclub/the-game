import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import ProjectCard from "@/components/projects/ProjectCard";

interface Props {
  queue: (Project & { username: string })[];
}

export default function Review({ queue }: Props) {
  return (
    <Layout>
      <div className="px-8">
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="smoothing-black text-4xl font-bold">
            Reviewer Dashboard
          </h1>
          <p className="text-gray-500 italic">not quite absolute power...</p>
        </div>
        <p className="mb-2 text-3xl font-semibold">Next up to review!</p>
        <div className="grid grid-cols-3 gap-5">
          {queue.map((project) => (
            <ProjectCard project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
