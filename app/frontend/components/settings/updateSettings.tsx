import { useForm } from "@inertiajs/react";

export default function ProjectCreate() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    desc: "",
    repo_link: "",
    demo_link: "",
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
              className="m-2 p-2 border border-black-300 "
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
              type="text"
              value={data.demo_link}
              onChange={(e) => setData("demo_link", e.target.value)}
            />
            {errors.demo_link && (
              <div className="text-red-500">{errors.demo_link}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="repo_link">Repository Link:</label>
            <input
              className="m-2"
              type="text"
              value={data.repo_link}
              onChange={(e) => setData("repo_link", e.target.value)}
            />
            {errors.repo_link && (
              <div className="text-red-500">{errors.repo_link}</div>
            )}
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
