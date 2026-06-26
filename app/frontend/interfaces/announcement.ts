export interface AnnouncementImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface Announcement {
  author_name: string;
  author_avatar_url: string;
  content: string;
  images?: AnnouncementImage[];
  timestamp: string;
  permalink: string;
}
