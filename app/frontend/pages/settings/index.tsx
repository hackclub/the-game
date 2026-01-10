import Sidebar from "@/components/sidebar";

export default function SettingsIndex(profile: { user: any }) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="text-2xl font-bold"> Settings Page </h1>
        <div className="flex flex-col gap-4">
          <p>Welcome, {profile.user.username}!</p>
          <p>Your email is: {profile.user.email}</p>
        </div>
      </main>
    </div>
  );
}
