export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex flex-col items-center justify-center">
        <button
          className="p-5  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          Create Project
        </button>
        <button
          className="p-5  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
