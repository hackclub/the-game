import Sidebar from "@/components/sidebar";

export default function AdminPage() {
  return (
  <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a href="/blazer" className="bg-red-100 rounded-lg shadow-md p-6 block hover:bg-red-300 transition-colors">
            Blazer
          </a>
        <a href="/admin/annoucements/" className="bg-red-300 rounded-lg shadow-md p-6 block hover:bg-red-200 transition-colors">
            Annoucements
          </a>
        </div>
      </main>
  </div>
  );
}
