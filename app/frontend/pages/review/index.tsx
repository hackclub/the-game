import React, { useState, useMemo } from "react";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import ProjectCard from "@/components/projects/ProjectCard";
import { Link } from "@inertiajs/react";
import formatTime from "@/utils/formatTime";

interface Props {
  queue: (Project & { username: string })[];
  all_queued: (Project & { username: string; ticket_count: number })[];
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
  const [search, setSearch] = useState("");

  const weekSorted = [...week_leaderboard].sort((a, b) => b.count - a.count);
  const alltimeSorted = [...alltime_leaderboard].sort(
    (a, b) => b.count - a.count,
  );

  const filteredQueue = useMemo(() => {
    if (!search.trim()) return all_queued;
    const term = search.toLowerCase().trim();
    return all_queued.filter(
      (project) =>
        project.title?.toLowerCase().includes(term) ||
        project.username?.toLowerCase().includes(term),
    );
  }, [all_queued, search]);

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
              <ProjectCard
                key={project.id}
                project={project}
                link={`/review/${project.id}`}
              />
            ))}
          </div>
        </div>

        <div className="py-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl font-semibold">Review Queue</h2>
              <span className="text-gray-500">
                {queue_count} project{queue_count !== 1 && "s"} remaining
              </span>
            </div>
            <div className="relative">
              <svg
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 rounded-lg border border-gray-300 py-1.5 pr-3 pl-9 text-sm transition-colors focus:border-[#fecb0d] focus:ring-1 focus:ring-[#fecb0d] focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#0f0f0f] text-white">
                <tr>
                  <th className="py-2.5 pr-3 pl-3 text-xs font-semibold uppercase tracking-wider">
                    #
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Screenshot
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Author
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Prior Approved
                  </th>
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider">
                    Tickets
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-gray-400 italic"
                    >
                      {search.trim()
                        ? "No projects match your search."
                        : "The queue is empty!"}
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((project, index) => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-100 transition-colors hover:bg-[#fecb0d]/10"
                    >
                      <td className="py-0 pr-3 pl-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-400"
                        >
                          {index + 1}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2"
                        >
                          {project.screenshot ? (
                            <img
                              src={project.screenshot}
                              alt={project.title ?? "Screenshot"}
                              className="h-10 w-[60px] rounded border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-[60px] items-center justify-center rounded border border-gray-200 bg-gray-100 text-[10px] text-gray-400">
                              N/A
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 font-medium text-[#0f0f0f] hover:underline"
                        >
                          {project.title}
                          {project.pending_hq && (
                            <span className="ml-2 rounded bg-yellow-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-800">
                              Pending HQ
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-600"
                        >
                          {project.username}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-500"
                        >
                          {new Date(
                            project.submitted_at!,
                          ).toLocaleDateString()}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-500"
                        >
                          {formatTime(project.reported_seconds)}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-500"
                        >
                          {project.real_approved_seconds > 0
                            ? formatTime(project.real_approved_seconds)
                            : "\u2014"}
                        </Link>
                      </td>
                      <td className="py-0 pr-3">
                        <Link
                          href={`/review/${project.id}`}
                          className="block py-2 text-gray-500"
                        >
                          {project.ticket_count}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                  key={user.id}
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
                  key={user.id}
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
