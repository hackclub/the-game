import { useForm } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import { HackatimeProject } from "@/interfaces/hackatime_project";
import formatTime from "@/utils/formatTime";

interface Props {
  hackatime_projects: HackatimeProject[];
  project: Project;
}

export default function EditProject({ project, hackatime_projects }: Props) {
  const {
    data,
    setData,
    patch,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    title: project.title,
    desc: project.desc,
    repo_link: project.repo_link,
    demo_link: project.demo_link,
    hackatime_project_keys: project.hackatime_projects ?? [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    patch(`/projects/${project.id}`);
  }

  function shipProject(e: React.FormEvent) {
    e.preventDefault();
    patch(`/projects/${project.id}/ship`);
  }

  function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this project?")) {
      destroy(`/projects/${project.id}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <br></br>
      <form onSubmit={submit}>
        <div className="mb-4">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            value={data.title ?? undefined}
            onChange={(e) => setData("title", e.target.value)}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            value={data.desc ?? undefined}
            onChange={(e) => setData("desc", e.target.value)}
          />
          {errors.desc && <div className="text-red-500">{errors.desc}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="demo_link">Demo Link:</label>
          <input
            type="text"
            value={data.demo_link ?? undefined}
            onChange={(e) => setData("demo_link", e.target.value)}
          />
          {errors.demo_link && (
            <p className="text-red-500">{errors.demo_link}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="hackatime_project_keys">Hackatime Projects:</label>
          <select
            multiple
            className="m-2 h-32 w-full border p-2"
            value={data.hackatime_project_keys.map(String)}
            onChange={(e) =>
              setData(
                "hackatime_project_keys",
                [...e.target.selectedOptions].map((o) => Number(o.value)),
              )
            }
          >
            {hackatime_projects.map((project) => {
              return (
                <option key={project.id} value={project.id}>
                  {project.name} ({formatTime(project.total_seconds)})
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="repo_link">Repository Link:</label>
          <input
            type="text"
            value={data.repo_link ?? undefined}
            onChange={(e) => setData("repo_link", e.target.value)}
          />
          {errors.repo_link && (
            <p className="text-red-500">{errors.repo_link}</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            className="rounded bg-green-500 p-5 px-4 py-2 font-bold text-white hover:bg-green-700"
            type="button"
            onClick={shipProject}
            disabled={processing}
            style={{
              display: project.aasm_state === "pending" ? "block" : "none",
            }}
          >
            Ship Project
          </button>
          <button
            className="rounded bg-blue-500 p-5 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="submit"
            disabled={processing}
          >
            Update Project
          </button>

          <button
            className="rounded bg-red-500 p-5 px-4 py-2 font-bold text-white hover:bg-red-700"
            type="button"
            onClick={handleDelete}
            disabled={processing}
          >
            Delete Project
          </button>
        </div>
      </form>
    </div>
  );
}
