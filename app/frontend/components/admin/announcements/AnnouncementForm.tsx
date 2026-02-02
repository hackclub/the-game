import { useForm } from "@inertiajs/react";
import type { Announcement } from "@/interfaces/announcement";

export default function AnnouncementForm({
  announcement,
}: {
  announcement?: Announcement;
}) {
  const { data, setData, post, patch } = useForm({
    title: announcement?.title,
    content: announcement?.content,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (announcement) {
      patch(`/admin/announcements/${announcement.id}`);
    } else {
      post("/admin/announcements");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col">
        <label className="font-bold">Title</label>
        <input
          className="rounded-md p-2"
          type="text"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Content</label>
        <textarea
          className="rounded-md p-2"
          value={data.content}
          onChange={(e) => setData("content", e.target.value)}
        />
      </div>

      <button className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
        Submit
      </button>
    </form>
  );
}
