import Layout from "@/layouts/layout";
import AnnouncementForm from "@/components/admin/announcements/AnnouncementForm";
import { Announcement } from "@/interfaces/announcement";

export default function EditAnnouncement({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Edit Announcement</h1>
      <AnnouncementForm announcement={announcement} />
    </Layout>
  );
}
