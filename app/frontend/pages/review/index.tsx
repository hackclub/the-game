import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import ProjectCard from "@/components/projects/ProjectCard";

interface Props {
  queue: (Project & { username: string })[];
  leaderboard: { id: number; name: string; count: number }[];
}

export default function Review({ queue, leaderboard }: Props) {
  const sorted = [...leaderboard].sort((a, b) => b.count - a.count);

  return (
    <Layout>
      <div className="px-8">
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="smoothing-black text-4xl font-bold">
            Reviewer Dashboard
          </h1>
          <p className="text-gray-500 italic">not quite absolute power...</p>
        </div>

        <div className="py-5">
          <h2 className="mb-2 text-3xl font-semibold">Next up to review!</h2>
          <div className="grid grid-cols-3 gap-5">
            {queue.map((project) => (
              <ProjectCard project={project} />
            ))}
          </div>
        </div>

        <div className="py-5">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-3xl font-semibold">Leaderboard</h2>
            <p className="text-gray-500 italic">
              Number of reviews in the past week
            </p>
          </div>

          <div className="flex max-w-xl flex-col gap-3">
            {sorted.map((user, index) => (
              <div
                className={`flex items-center gap-3 rounded-md ${index == 0 ? "bg-yellow-500" : index == 1 ? "bg-gray-400" : index == 2 ? "bg-amber-600" : "bg-gray-200"} p-4`}
              >
                <p className="pr-5 pl-2 font-bold">{index + 1}</p>
                <p className="font-bold">{user.name}</p>
                <div className="grow"></div>
                <p>
                  {user.count} review{user.count > 1 && "s"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
