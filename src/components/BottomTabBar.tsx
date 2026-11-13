"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";
import { useDashboard } from "@/lib/dashboard";

interface BottomTabBarProps {
  notificationCount: number;
}

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/feed", label: "Feed", icon: "home" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/messages", label: "Messages", icon: "message" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export default function BottomTabBar({ notificationCount }: BottomTabBarProps) {
  const pathname = usePathname();

  const renderTab = (tab: { href: string; label: string; icon: IconName }) => {
    const isActive =
      pathname === tab.href || pathname.startsWith(tab.href + "/");
    return (
      <Link
        key={tab.href}
        href={tab.href}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex flex-1 flex-col items-center gap-1 rounded-full px-1 py-1.5 transition-all duration-200 ease-soft ${
          isActive ? "text-accent" : "text-ink-mute hover:text-ink-soft"
        }`}
      >
        <Icon name={tab.icon} className="h-[22px] w-[22px]" />
        <span className="text-[10px] font-semibold tracking-tight">
          {tab.label}
        </span>
      </Link>
    );
  };

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto w-full max-w-[480px] px-4 pt-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-1 rounded-full border border-line/70 bg-glass p-1.5 shadow-float backdrop-blur-xl backdrop-saturate-150">
          {renderTab(tabs[0])}
          {renderTab(tabs[1])}

          {/* Center spacer */}
          <div className="flex flex-1" />

          {renderTab(tabs[2])}
          {renderTab(tabs[3])}
        </div>
      </div>
    </nav>
  );
}
