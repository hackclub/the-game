import Sidebar from "@/components/sidebar";

export default function SettingsIndex(profile: { user: any }) {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <h1 className="text-2xl font-bold"> Settings Page </h1>
        <div className="flex flex-col gap-4">
          <p>Welcome, {profile.user.username}!</p>
          <p>Your email is: {profile.user.email}</p>
        </div>
      </main>
    </div>
  );
}
