import { useForm } from "@inertiajs/react";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import { useMemo } from "react";

interface Props {
  hackatime_projects: HackatimeProject[];
  project?: Project;
}

export default function ProjectForm({ hackatime_projects, project }: Props) {
  const { data, setData, post, patch, processing, errors, progress } = useForm({
    title: project?.title ?? "",
    desc: project?.desc ?? "",
    repo_link: project?.repo_link ?? "",
    demo_link: project?.demo_link ?? "",
    hackatime_project_keys: project?.hackatime_projects ?? ([] as number[]),
    screenshot: (project?.screenshot ? 0 : null) as File | 0 | null,
  });

  const disabled = !(
    !project ||
    project?.aasm_state === "pending" ||
    project?.aasm_state === "rejected"
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (project) {
      patch(`/projects/${project.id}`, {
        forceFormData: true,
      });
    } else {
      post("/projects/", {
        forceFormData: true,
      });
    }
  }

  const sortedHackatimeProjects = useMemo(
    () => hackatime_projects.sort((a, b) => b.total_seconds - a.total_seconds),
    [hackatime_projects],
  );

  return (
    <>
      <div className="flex flex-col">
        <form onSubmit={submit} className="flex max-w-lg flex-col gap-4">
          <br></br>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="title">
              Title
            </label>
            <input
              className="rounded-md p-2"
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              disabled={disabled}
            />

            {errors.title && <div className="text-red-500">{errors.title}</div>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="desc">
              Description
            </label>
            <input
              className="rounded-md p-2"
              type="text"
              value={data.desc}
              onChange={(e) => setData("desc", e.target.value)}
              disabled={disabled}
            />
            {errors.desc && <div className="text-red-500">{errors.desc}</div>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="demo_link">
              Demo Link
            </label>
            <input
              className="rounded-md p-2"
              type="url"
              value={data.demo_link}
              onChange={(e) => setData("demo_link", e.target.value)}
              disabled={disabled}
            />
            {errors.demo_link && (
              <div className="text-red-500">{errors.demo_link}</div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="repo_link">
              Repository Link
            </label>
            <input
              className="rounded-md p-2"
              type="url"
              value={data.repo_link}
              onChange={(e) => setData("repo_link", e.target.value)}
              disabled={disabled}
            />
            {errors.repo_link && (
              <div className="text-red-500">{errors.repo_link}</div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Screenshot</label>
            {data.screenshot === 0 && (
              <div className="relative h-52 w-fit p-2">
                <img
                  src={project?.screenshot}
                  alt="Uploaded screenshot"
                  className="block max-h-full w-auto max-w-full object-contain"
                />
                {!disabled && (
                  <button
                    type="button"
                    className="absolute top-5 right-5 h-10 w-10 cursor-pointer rounded-full border-2 border-black bg-red-400"
                    onClick={() => {
                      setData("screenshot", null);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            )}
            {!disabled && (
              <input
                type="file"
                onChange={(e) =>
                  setData("screenshot", e.target.files?.[0] ?? null)
                }
              />
            )}
            {progress && (
              <progress value={progress.percentage} max="100">
                {progress.percentage}%
              </progress>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Hackatime Projects</label>
            <select
              className="rounded-md p-2"
              multiple
              onChange={(e) =>
                setData(
                  "hackatime_project_keys",
                  [...e.target.selectedOptions].map((o) => Number(o.value)),
                )
              }
              disabled={disabled}
            >
              <option
                disabled
                selected={!project?.hackatime_projects?.length}
                value="-1"
              >
                Select a project
              </option>
              {sortedHackatimeProjects.map((hp) => {
                return (
                  <option
                    key={hp.id}
                    value={hp.id}
                    selected={data.hackatime_project_keys.includes(hp.id)}
                  >
                    {hp.name} ({formatTime(hp.total_seconds)})
                  </option>
                );
              })}
            </select>
          </div>

          {!disabled && (
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                type="submit"
                disabled={processing}
              >
                {project ? "Update" : "Create"} Project
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
