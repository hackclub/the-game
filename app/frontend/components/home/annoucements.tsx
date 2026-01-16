export default function Announcements({ announcements }: { announcements: string[] }) {
  announcements.sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {announcements.map((announcement, index) => (
        <p key={index}>{announcement}</p>
      ))}
    </div>
  );
}
