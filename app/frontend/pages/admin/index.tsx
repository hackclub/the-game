export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>
      <div className="flex flex-col items-center justify-center">
        <button
          className="rounded bg-blue-500 p-5 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="button"
        >
          Create Project
        </button>
        <button
          className="rounded bg-red-500 p-5 px-4 py-2 font-bold text-white hover:bg-red-700"
          type="button"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
