"use client";

import Link from "next/link";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./icons";
import { useDashboard } from "@/lib/dashboard";
import {
  dashboardTopBarActionsClass,
  dashboardTopBarClass,
  dashboardTopBarTitleClass,
} from "./dashboard-layout";

interface TopBarProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    department: string;
  };
  title: string;
  onLogout: () => void;
}

export default function TopBar({ user, title }: TopBarProps) {
  const { notificationCount } = useDashboard();

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-glass backdrop-blur-xl backdrop-saturate-150">
      <div className={dashboardTopBarClass}>
        <div className={dashboardTopBarTitleClass}>
          <BrandMark className="hidden h-9 w-9 sm:flex" />
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-ink sm:text-lg">
              {title}
            </h1>
            <p className="hidden truncate text-xs text-ink-mute sm:block">
              Welcome back, {user.name.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className={dashboardTopBarActionsClass}>
          <Link
            href="/notifications"
            className="icon-btn relative shrink-0"
            aria-label={
              notificationCount > 0
                ? `Notifications, ${notificationCount} unread`
                : "Notifications"
            }
            title="Notifications"
          >
            <Icon name="bell" className="h-5 w-5" />
            {notificationCount > 0 && (
              <span
                aria-hidden
                className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
              />
            )}
          </Link>
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href="/settings"
            className="icon-btn shrink-0"
            aria-label="Settings"
            title="Settings"
          >
            <Icon name="settings" className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
