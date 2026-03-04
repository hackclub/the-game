import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Notification } from "@/interfaces/notification";
import type { ProjectReview } from "@/interfaces/project_review";
import NotificationCard from "@/components/notifications/Notification";

export default function Notifications({
  notifications,
}: {
  notifications: (Notification & { notifiable: ProjectReview })[];
}) {
  return (
    <Layout>
      <PageHeading title="Notifications" />

      <div className="my-5 flex flex-col gap-4">
        {notifications.map((notification) => (
          <NotificationCard notification={notification} />
        ))}
        {notifications.length === 0 && (
          <p className="text-lg">No notifications yet.</p>
        )}
      </div>
    </Layout>
  );
}
