"use client";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
}

const sizeMap = {
  sm: { box: "h-8 w-8", text: "text-2xs", pad: "p-[2px]", dot: "h-2.5 w-2.5" },
  md: { box: "h-10 w-10", text: "text-xs", pad: "p-[2px]", dot: "h-3 w-3" },
  lg: { box: "h-12 w-12", text: "text-sm", pad: "p-[3px]", dot: "h-3.5 w-3.5" },
  xl: { box: "h-20 w-20", text: "text-xl", pad: "p-1", dot: "h-4 w-4" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, src, size = "md", isOnline }: AvatarProps) {
  const sizeClass = sizeMap[size];

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClass.box}`}>
      {/* Gradient ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent-2"
      />
      <span
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-elevated ${sizeClass.pad}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-semibold text-on-accent ${sizeClass.text}`}
          >
            {getInitials(name)}
          </span>
        )}
      </span>

      {isOnline !== undefined && (
        <span
          className={`absolute right-0 bottom-0 block ${sizeClass.dot} rounded-full ring-2 ring-elevated ${
            isOnline ? "bg-success" : "bg-ink-mute/60"
          }`}
        />
      )}
    </div>
  );
}
