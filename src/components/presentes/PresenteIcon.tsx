import type { IconType } from "@/data/presentes";

const iconMap: Record<IconType, string> = {
  heart: "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z",
  home: "M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z",
  knife: "M3 21l3-3 12-12-3-3-12 12-3 6h3z",
  pot: "M5 9h14l-1 11a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9zM3 8h18M9 5V3h6v2",
  cup: "M5 4h14l-1 14a3 3 0 01-3 3H9a3 3 0 01-3-3L5 4zM19 7h2a2 2 0 010 4h-2",
  plate: "M12 22a10 10 0 100-20 10 10 0 000 20zm0-4a6 6 0 100-12 6 6 0 000 12z",
  spoon: "M14 4a4 4 0 11-1 7l-7 9-2-2 9-7a4 4 0 011-7z",
  tray: "M3 8h18l-2 12H5L3 8zM6 12h12M2 5h20",
  towel: "M5 3h14v18l-7-3-7 3V3zM8 7h8M8 11h8",
  bed: "M3 18v-6a4 4 0 014-4h10a4 4 0 014 4v6M3 18h18M3 18v3M21 18v3M7 12a3 3 0 016 0",
  blanket: "M4 4h16v14l-4 3H8l-4-3V4zM4 9h16M4 14h16",
  drainer: "M5 4h14v3H5zM6 7l2 12h8l2-12M9 11v5M12 11v5M15 11v5",
  filter: "M5 3h14l-2 8a4 4 0 01-4 3h-2a4 4 0 01-4-3L5 3zM10 14v6h4v-6",
  blender: "M9 3h6v4l-1 6H10l-1-6V3zM12 13v8M9 21h6",
  coffee: "M5 9h12v8a4 4 0 01-4 4H9a4 4 0 01-4-4V9zM17 11h2a2 2 0 010 4h-2M9 5V3M12 5V3M15 5V3",
  fryer: "M4 8h16v10a3 3 0 01-3 3H7a3 3 0 01-3-3V8zM7 5h10v3H7zM10 13h4",
  sandwich: "M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V8zM3 12h18",
  dinner: "M5 21V3M9 11a4 4 0 00-4-4M19 21V3a2 2 0 00-2 2v8c0 1 1 1 2 1",
  honeymoon: "M2 12h20M2 12a10 10 0 0120 0M5 8a7 7 0 0114 0M9 4a3 3 0 016 0",
};

export function PresenteIcon({
  type,
  className,
}: {
  type: IconType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={iconMap[type]} />
    </svg>
  );
}
