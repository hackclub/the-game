import { useForm } from "@inertiajs/react";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";

interface Props {
  hackatime_projects: HackatimeProject[];
  project?: Project;
}

export default function ProjectForm({ hackatime_projects, project }: Props) {
  const {
    data,
    setData,
    post,
    patch,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    title: project?.title ?? "",
    desc: project?.desc ?? "",
    repo_link: project?.repo_link ?? "",
    demo_link: project?.demo_link ?? "",
    hackatime_project_keys: project?.hackatime_projects ?? ([] as number[]),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (project) {
      patch(`/projects/${project.id}`);
    } else {
      post("/projects/");
    }
  }

  function shipProject(e: React.FormEvent) {
    e.preventDefault();
    patch(`/projects/${project!.id}/ship`);
  }

  function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this project?")) {
      destroy(`/projects/${project!.id}`);
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <form onSubmit={submit} className="flex max-w-lg flex-col gap-4">
          <br></br>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="title">
              Title
            </label>
            <input
              className="p-2"
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />

            {errors.title && <div className="text-red-500">{errors.title}</div>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="desc">
              Description
            </label>
            <input
              className="p-2"
              type="text"
              value={data.desc}
              onChange={(e) => setData("desc", e.target.value)}
            />
            {errors.desc && <div className="text-red-500">{errors.desc}</div>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="demo_link">
              Demo Link
            </label>
            <input
              className="p-2"
              type="url"
              value={data.demo_link}
              onChange={(e) => setData("demo_link", e.target.value)}
            />
            {errors.demo_link && (
              <div className="text-red-500">{errors.demo_link}</div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Hackatime Projects</label>
            <select
              className="p-2"
              onChange={(e) =>
                setData(
                  "hackatime_project_keys",
                  [...e.target.selectedOptions].map((o) => Number(o.value)),
                )
              }
            >
              {hackatime_projects.map((hp) => {
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

          <div className="flex flex-col">
            <label className="font-bold" htmlFor="repo_link">
              Repository Link
            </label>
            <input
              className="p-2"
              type="url"
              value={data.repo_link}
              onChange={(e) => setData("repo_link", e.target.value)}
            />
            {errors.repo_link && (
              <div className="text-red-500">{errors.repo_link}</div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              type="submit"
              disabled={processing}
            >
              {project ? "Update" : "Create"} Project
            </button>
            {/* <button
            className="rounded bg-green-500 p-5 px-4 py-2 font-bold text-white hover:bg-green-700"
            type="button"
            onClick={shipProject}
            disabled={processing}
            style={{
              display: project.aasm_state === "pending" ? "block" : "none",
            }}
          >
            Ship Project
          </button> */}

            {project && (
              <button
                className="rounded bg-red-500 p-5 px-4 py-2 font-bold text-white hover:bg-red-700"
                type="button"
                onClick={handleDelete}
                disabled={processing}
              >
                Delete Project
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
