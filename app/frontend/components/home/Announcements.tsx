import { Announcement } from "@/interfaces/announcement";

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-5xl font-bold tracking-[-0.06em]">Announcements</h2>
      <p className="text-2xl text-[#606060]">
        Click on any of them to read the full thing!
      </p>
      <div className="flex flex-wrap gap-4">
        {announcements.map((announcement, index) => (
          <a
            key={index}
            href={announcement.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-[367px]"
          >
            <div className="bg-black h-[37px] rounded-tl-2xl rounded-tr-2xl" />
            <div className="bg-white border-2 border-black border-t-0 rounded-bl-2xl rounded-br-2xl overflow-clip px-5 py-5">
              <div className="flex gap-1 items-center mb-4">
                <img
                  src={announcement.author_avatar_url}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={announcement.author_name}
                />
                <span className="font-bold text-2xl tracking-[-0.02em]">
                  @{announcement.author_name}
                </span>
              </div>
              <div
                className="text-xl tracking-[-0.02em] overflow-hidden text-ellipsis h-24 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
