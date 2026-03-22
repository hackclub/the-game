import React from "react";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import ProjectCard from "@/components/projects/ProjectCard";
import { Link } from "@inertiajs/react";
import formatTime from "@/utils/formatTime";

interface Props {
  queue: (Project & { username: string })[];
  all_queued: (Project & { username: string })[];
  queue_count: number;
  week_leaderboard: { id: number; name: string; count: number }[];
  alltime_leaderboard: { id: number; name: string; count: number }[];
}

export default function Review({
  queue,
  all_queued,
  queue_count,
  week_leaderboard,
  alltime_leaderboard,
}: Props) {
  const weekSorted = [...week_leaderboard].sort((a, b) => b.count - a.count);
  const alltimeSorted = [...alltime_leaderboard].sort(
    (a, b) => b.count - a.count,
  );

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
              <ProjectCard project={project} link={`/review/${project.id}`} />
            ))}
          </div>
        </div>

        <div className="py-5">
          <div className="mb-3 flex items-baseline gap-4">
            <h2 className="text-3xl font-semibold">Review Queue</h2>
            <span className="text-gray-500">
              {queue_count} project{queue_count !== 1 && "s"} remaining
            </span>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-4 font-semibold">#</th>
                <th className="py-2 pr-4 font-semibold">Title</th>
                <th className="py-2 pr-4 font-semibold">Author</th>
                <th className="py-2 pr-4 font-semibold">Submitted</th>
                <th className="py-2 pr-4 font-semibold">Reported Hours</th>
                <th className="py-2 pr-4 font-semibold">
                  Prior Approved Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {all_queued.map((project, index) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {(
                    [
                      <span className="text-gray-400">{index + 1}</span>,
                      <span className="font-medium">{project.title}</span>,
                      <span className="text-gray-600">{project.username}</span>,
                      <span className="text-gray-500">
                        {new Date(project.submitted_at!).toLocaleDateString()}
                      </span>,
                      <span className="text-gray-500">
                        {formatTime(project.reported_seconds)}
                      </span>,
                      <span className="text-gray-500">
                        {project.real_approved_seconds > 0
                          ? formatTime(project.real_approved_seconds)
                          : "—"}
                      </span>,
                    ] as React.ReactNode[]
                  ).map((cell, i) => (
                    <td key={i} className="py-0 pr-4">
                      <Link
                        href={`/review/${project.id}`}
                        className="block py-2"
                      >
                        {cell}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-5">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-3xl font-semibold">Leaderboard</h2>
            <p className="text-gray-500 italic">
              Number of reviews in the past week
            </p>
          </div>

          <div className="flex w-full gap-3">
            <div className="flex max-w-xl flex-col gap-3">
              <p className="text-2xl font-bold">Last week</p>
              {weekSorted.map((user, index) => (
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
            <div className="flex max-w-xl flex-col gap-3">
              <p className="text-2xl font-bold">All time</p>
              {alltimeSorted.map((user, index) => (
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
      </div>
    </Layout>
  );
}
