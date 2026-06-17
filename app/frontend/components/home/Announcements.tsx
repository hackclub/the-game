import { Announcement } from "@/interfaces/announcement";

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-bold tracking-[-0.06em]">Announcements</h2>
        <p className="text-2xl text-[#606060]">
          Click on any of them to read the full thing!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
        {announcements.map((announcement, index) => (
          <a
            key={index}
            href={announcement.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col transition-transform duration-200 hover:scale-[1.03]"
          >
            <div className="h-[37px] rounded-tl-2xl rounded-tr-2xl bg-black" />
            <div className="flex-1 overflow-clip rounded-br-2xl rounded-bl-2xl border-2 border-t-0 border-black bg-white px-5 py-5">
              <div className="mb-4 flex items-center gap-1">
                <img
                  src={announcement.author_avatar_url}
                  className="h-8 w-8 rounded-full object-cover"
                  alt={announcement.author_name}
                />

                <span className="smoothing-black text-2xl font-bold tracking-[-0.02em]">
                  @{announcement.author_name}
                </span>
              </div>

              <div
                className="smoothing-black line-clamp-4 text-xl tracking-[-0.02em] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
