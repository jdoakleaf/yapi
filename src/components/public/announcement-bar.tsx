interface AnnouncementBarProps {
  text?: string;
  link?: string;
  active?: boolean;
}

export function AnnouncementBar({ text, link, active }: AnnouncementBarProps) {
  if (!active || !text) return null;

  return (
    <div className="bg-[#1769AA] py-2 text-center text-xs font-medium text-white sm:text-sm">
      {link ? (
        <a href={link} className="hover:underline">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
