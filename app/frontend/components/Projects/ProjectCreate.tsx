import { useForm } from "@inertiajs/react";

interface Props {
  hackatime_projects: { id: number; name: string }[];
  project_times: Record<string, number>;
}

export default function ProjectCreate({
  hackatime_projects,
  project_times,
}: Props) {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    desc: "",
    repo_link: "",
    demo_link: "",
    hackatime_project_keys: [] as number[],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post("/projects/");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={submit}>
          <br></br>
          <div className="mb-4">
            <label htmlFor="title">Title:</label>
            <input
              className="m-2 p-2"
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />

            {errors.title && <div className="text-red-500">{errors.title}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="desc">Description:</label>
            <input
              className="border-black-300 m-2 border p-2"
              type="text"
              value={data.desc}
              onChange={(e) => setData("desc", e.target.value)}
            />
            {errors.desc && <div className="text-red-500">{errors.desc}</div>}
          </div>
          <div className="mb-4 gap-2">
            <label htmlFor="demo_link">Demo Link:</label>
            <input
              className="m-2"
              type="url"
              value={data.demo_link}
              onChange={(e) => setData("demo_link", e.target.value)}
            />
            {errors.demo_link && (
              <div className="text-red-500">{errors.demo_link}</div>
            )}
          </div>
          <div className="mb-4">
            <label>Hackatime Projects:</label>
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
              {hackatime_projects.map((hp) => {
                const totalSeconds = project_times[hp.name] || 0;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                return (
                  <option key={hp.id} value={hp.id}>
                    {hp.name} ({hours}h {minutes}m)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="repo_link">Repository Link:</label>
            <input
              className="m-2"
              type="url"
              value={data.repo_link}
              onChange={(e) => setData("repo_link", e.target.value)}
            />
            {errors.repo_link && (
              <div className="text-red-500">{errors.repo_link}</div>
            )}
          </div>

          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="submit"
            disabled={processing}
          >
            Create Project
          </button>
        </form>
      </div>
    </>
  );
  console.log(data);
}
