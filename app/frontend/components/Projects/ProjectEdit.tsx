import { useForm, usePage } from "@inertiajs/react";

interface Props {
  hackatime_projects: { id: number; name: string }[];
  project_times: Record<string, number>;
}

export default function EditProject({
  project,
  hackatime_projects,
  project_times,
}: Props) {
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
    approved: project.approved,
    hackatime_project_keys: hackatime_projects,
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

  const isShipped = data.approved === "shipped" ? true : false;

  return (
    <div className="flex flex-col items-center justify-center">
      <br></br>
      <form onSubmit={submit}>
        <div className="mb-4">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            value={data.desc}
            onChange={(e) => setData("desc", e.target.value)}
          />
          {errors.desc && <div className="text-red-500">{errors.desc}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="demo_link">Demo Link:</label>
          <input
            type="text"
            value={data.demo_link}
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
            className="m-2 p-2 border w-full h-32"
            value={data.hackatime_project_keys.map(String)}
            onChange={(e) =>
              setData(
                "hackatime_project_keys",
                [...e.target.selectedOptions].map((o) => o.value),
              )
            }
          >
            {hackatime_projects.map((project) => {
              const totalSeconds = project_times[project.name] || 0;
              const hours = Math.floor(totalSeconds / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              const formattedTime = `${hours}h ${minutes}m`;

              return (
                <option key={project.id} value={project.id}>
                  {project.name} ({formattedTime})
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="repo_link">Repository Link:</label>
          <input
            type="text"
            value={data.repo_link}
            onChange={(e) => setData("repo_link", e.target.value)}
          />
          {errors.repo_link && (
            <p className="text-red-500">{errors.repo_link}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            className="p-5  bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={shipProject}
            disabled={processing}
            style={{ display: isShipped ? "none" : "block" }}
          >
            Ship Project
          </button>
          <button
            className="p-5  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={processing}
          >
            Update Project
          </button>

          <button
            className="p-5  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
