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
      <h1 className="text-2xl font-bold mb-4">Add a new Project!</h1>
      <form onSubmit={submit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />
        <label htmlFor="desc">Description:</label>
        <input
          type="text"
          value={data.desc}
          onChange={(e) => setData("desc", e.target.value)}
        />
        <label htmlFor="demo_link">Demo Link:</label>
        <input
          type="text"
          value={data.demo_link}
          onChange={(e) => setData("demo_link", e.target.value)}
        />
        <label htmlFor="repo_link">Repository Link:</label>
        <input
          type="text"
          value={data.repo_link}
          onChange={(e) => setData("repo_link", e.target.value)}
        />
        
        <button className="" type="submit" disabled={processing}>
          Create Project
        </button>
      </form>
    </>
  );
  console.log(data);
}
