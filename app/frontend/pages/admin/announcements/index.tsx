import Layout from "@/layouts/layout";
import { Link, router } from "@inertiajs/react";
import AnnouncementForm from "@/components/admin/announcements/AnnouncementForm";
import { Announcement } from "@/interfaces/announcement";

interface DBannouncement {
  id: number;
  title: string;
  content: string;
}

interface SlackAnnouncement {
  author_name: string;
  author_avatar_url: string;
  content: string;
  timestamp: string;
  slack_ts: string;
  permalink: string;
}

export default function Announcements({
  announcements,
  slack_announcements,
}: {
  announcements: DBannouncement[];
  slack_announcements: SlackAnnouncement[];
}) {
  function blockSlack(slackTs: string) {
    router.post("/admin/announcements/block_slack", { ts: slackTs });
  }

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Announcements</h1>

      <div className="flex flex-col gap-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex items-start justify-between gap-4 rounded-md border border-gray-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold">{announcement.title}</p>
              <p className="text-sm text-gray-600">{announcement.content}</p>
            </div>
            <div className="flex shrink-0 gap-2 text-sm">
              <a
                className="text-blue-500 underline"
                href={`/admin/announcements/${announcement.id}/edit`}
              >
                Edit
              </a>
              <Link
                className="cursor-pointer text-red-500 underline"
                href={`/admin/announcements/${announcement.id}`}
                method="delete"
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-2 text-2xl font-bold">Create Announcement</h2>
      <AnnouncementForm />

      {slack_announcements.length > 0 && (
        <>
          <h2 className="mt-10 mb-1 text-2xl font-bold">Slack Announcements</h2>
          <p className="mb-3 text-sm text-gray-500">
            These are pulled from the Slack bulletin channel. Hiding one removes
            it from the homepage.
          </p>
          <div className="flex flex-col gap-3">
            {slack_announcements.map((sa, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-md border border-gray-200 bg-white p-4"
              >
                {sa.author_avatar_url && (
                  <img
                    src={sa.author_avatar_url}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-full"
                    alt=""
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">@{sa.author_name}</p>
                  <div
                    className="mt-1 line-clamp-3 text-sm text-gray-700 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: sa.content }}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(sa.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => blockSlack(sa.slack_ts)}
                  className="shrink-0 cursor-pointer rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  Hide
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
