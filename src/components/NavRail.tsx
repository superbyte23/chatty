"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { Icon, type IconName } from "./icons";
import { useDashboard } from "@/lib/dashboard";

interface NavRailProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    department: string;
  };
  notificationCount: number;
  onLogout: () => void;
}

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/feed", label: "Feed", icon: "home" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/messages", label: "Messages", icon: "message" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export default function NavRail({
  user,
  notificationCount,
  onLogout,
}: NavRailProps) {
  const pathname = usePathname();
  const { openComposer } = useDashboard();

  return (
    <nav
      aria-label="Primary"
      className="flex h-full flex-col gap-1 py-6"
    >
      <Link
        href="/feed"
        className="mb-4 flex items-center gap-3 px-2"
        aria-label="KCC Chat home"
      >
        <BrandMark className="h-10 w-10" />
        <span className="hidden text-lg font-semibold tracking-tight text-ink xl:block">
          KCC Chat
        </span>
      </Link>

      <button
        type="button"
        onClick={openComposer}
        className="btn btn-primary mb-4 w-full"
        aria-label="Create post"
      >
        <Icon name="plus" className="h-5 w-5" />
        <span className="hidden xl:inline">Create post</span>
      </button>

      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-semibold transition-all duration-200 ease-soft ${
              isActive
                ? "bg-accent-soft text-accent"
                : "text-ink-soft hover:bg-muted hover:text-ink"
            }`}
          >
            <span className="relative">
              <Icon name={item.icon} className="h-[22px] w-[22px]" />
            </span>
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto flex items-center gap-1 border-t border-line-soft pt-3">
        <Link
          href="/profile"
          className="flex min-h-11 flex-1 items-center gap-3 rounded-full px-2 transition-colors duration-200 hover:bg-muted"
          aria-label="My profile"
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <span className="hidden min-w-0 xl:block">
            <span className="block truncate text-sm font-semibold text-ink">
              {user.name}
            </span>
            <span className="block truncate text-xs text-ink-mute">
              {user.department || "KCC student"}
            </span>
          </span>
        </Link>

        <ThemeToggle className="shrink-0" />

        <button
          onClick={onLogout}
          className="icon-btn shrink-0 hover:bg-danger-soft hover:text-danger"
          aria-label="Sign out"
          title="Sign out"
        >
          <Icon name="logout" className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
