import { Announcement } from "@/interfaces/announcement";

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  if (announcements.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-bold tracking-[-0.06em]">Announcements</h2>
        <p className="text-2xl text-[#606060]">
          Click on any of them to read the full thing!
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {announcements.map((announcement, index) => (
          <a
            key={index}
            href={announcement.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full flex-col transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="h-[37px] rounded-tl-2xl rounded-tr-2xl bg-black" />
            <div className="flex w-full flex-1 flex-col gap-4 overflow-clip rounded-br-2xl rounded-bl-2xl border-2 border-t-0 border-black bg-white px-6 py-5">
              <div className="flex items-center gap-2">
                <img
                  src={announcement.author_avatar_url}
                  className="h-8 w-8 rounded-full object-cover"
                  alt={announcement.author_name}
                />

                <span className="smoothing-black text-2xl font-bold tracking-[-0.02em]">
                  @{announcement.author_name}
                </span>

                {formatDate(announcement.timestamp) && (
                  <span className="ml-auto text-base font-medium text-[#909090]">
                    {formatDate(announcement.timestamp)}
                  </span>
                )}
              </div>

              {announcement.content && (
                <div
                  className="smoothing-black text-xl leading-snug tracking-[-0.02em] [&_a]:underline [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-base [&_p]:mt-2 [&_p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              )}

              {announcement.images && announcement.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {announcement.images.map((src, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={src}
                      alt=""
                      loading="lazy"
                      className="max-h-[28rem] w-auto max-w-full rounded-xl border-2 border-black object-contain"
                    />
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
