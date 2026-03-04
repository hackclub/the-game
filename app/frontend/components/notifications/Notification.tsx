import type { Notification } from "@/interfaces/notification";
import type { ProjectReview } from "@/interfaces/project_review";

export default function Notification({
  notification,
}: {
  notification: Notification & { notifiable: ProjectReview };
}) {
  let type;
  let path;

  switch (notification.notifiable_type) {
    case "Project::Review":
      type = "Review";
      path = `/projects/${notification.notifiable.project_id}`;
      break;
    default:
      type = "Other";
      path = "#";
      break;
  }

  return (
    <div
      key={notification.id}
      className="rounded-lg border-2 bg-white p-5 text-lg"
    >
      <p>
        <a className="font-semibold text-blue-500 underline" href={path}>
          {type}
        </a>{" "}
        • {new Date(notification.created_at).toLocaleString()}
      </p>
      <p>{notification.message}</p>
    </div>
  );
}
