import { useForm } from "@inertiajs/react";
import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  hackatime_projects: HackatimeProject[];
}

export default function ProjectCreate({ hackatime_projects }: Props) {
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
                console.log(hp);
                const totalSeconds = hp["total_seconds"];
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                return (
                  <option
                    key={hp.id}
                    value={hp.id}
                    selected={data.hackatime_project_keys.includes(hp.id)}
                  >
                    {hp.name} ({hours}h {minutes}m)
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
