import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import AnnouncementForm from "@/components/admin/announcements/AnnouncementForm";
import { Announcement } from "@/interfaces/announcement";

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Announcements</h1>
      <div className="flex flex-col gap-5">
        {announcements.map((announcement) => (
          <div className="rounded-md border border-black bg-white p-4">
            <p className="font-bold">{announcement.title}</p>
            <p>{announcement.content}</p>
            <p>
              <a
                className="text-blue-500 underline"
                href={`/admin/announcements/${announcement.id}/edit`}
              >
                Edit
              </a>{" "}
              |{" "}
              <Link
                className="cursor-pointer text-blue-500 underline"
                href={`/admin/announcements/${announcement.id}`}
                method="delete"
              >
                Delete
              </Link>
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-2xl font-bold">Create Announcement</h2>
      <AnnouncementForm />
    </Layout>
  );
}
