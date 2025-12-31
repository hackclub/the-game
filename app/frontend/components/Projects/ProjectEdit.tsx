import { useForm } from "@inertiajs/react";

interface Project {
  id: number;
  title: string | null;
  desc: string | null;
  repo_link: string | null;
  demo_link: string | null;
}

export default function EditProject({ project }: { project: Project }) {
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
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            value={data.desc}
            onChange={(e) => setData("desc", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="demo_link">Demo Link:</label>
          <input
            type="text"
            value={data.demo_link}
            onChange={(e) => setData("demo_link", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="repo_link">Repository Link:</label>
          <input
            type="text"
            value={data.repo_link}
            onChange={(e) => setData("repo_link", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            className="p-5  bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={shipProject}
            disabled={processing}
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
