"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/TopBar";
import BottomTabBar from "@/components/BottomTabBar";
import NavRail from "@/components/NavRail";
import RightSidebar from "@/components/RightSidebar";
import { apiFetch, clearAuthToken } from "@/lib/api";
import { DashboardProvider } from "@/lib/dashboard";
import {
  dashboardBodyClass,
  dashboardTopBarActionsClass,
  dashboardTopBarClass,
  dashboardTopBarTitleClass,
} from "./dashboard-layout";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department: string;
  year: string;
  bio: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/feed": "Feed",
  "/explore": "Explore",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/profile": "My Profile",
  "/settings": "Settings",
};

function pageTitleFor(pathname: string): string {
  if (pathname.startsWith("/profile/")) return "Profile";
  if (pathname.startsWith("/messages/")) return "Messages";
  return pageTitles[pathname] ?? "KCC Chat";
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const userRes = await apiFetch("/api/auth/me");
        if (!userRes.ok) {
          if (active) {
            clearAuthToken();
            window.location.assign("/login");
          }
          return;
        }

        const userData = await userRes.json();
        if (active) setUser(userData);

        // Notifications must never block an authenticated dashboard.
        try {
          const notifRes = await apiFetch("/api/notifications");
          if (notifRes.ok && active) {
            const notifData = await notifRes.json();
            setNotificationCount(notifData.unreadCount || 0);
          }
        } catch {
          // ignore
        }
      } catch {
        if (active) window.location.assign("/login");
      } finally {
        if (active) setLoading(false);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    clearAuthToken();
    window.location.assign("/login");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="h-16 border-b border-line/70 bg-glass backdrop-blur-xl">
          <div className={dashboardTopBarClass}>
            <div className={dashboardTopBarTitleClass}>
              <div className="skeleton h-4 w-28" />
            </div>
            <div className={dashboardTopBarActionsClass}>
              <div className="skeleton h-11 w-11 rounded-full" />
            </div>
          </div>
        </div>
        <div className={dashboardBodyClass}>
          <div className="hidden w-[88px] shrink-0 lg:block xl:w-[240px]" />
          <main className="min-w-0 flex-1 pt-6 lg:pl-6 lg:pr-0">
            <div className="w-full max-w-[600px] mx-auto lg:mx-0 space-y-6">
              <div className="skeleton h-36 w-full rounded-2xl" />
              <div className="skeleton h-64 w-full rounded-2xl" />
              <div className="skeleton h-64 w-full rounded-2xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardProvider
      notificationCount={notificationCount}
      signOut={handleLogout}
      user={user}
    >
      <div className="relative min-h-screen bg-surface">
        <TopBar
          user={user}
          title={pageTitleFor(pathname)}
          onLogout={handleLogout}
        />

        <div className={dashboardBodyClass}>
          {/* Left navigation rail (desktop) */}
          <aside className="hidden shrink-0 lg:block lg:w-[88px] xl:w-[240px]">
            <div className="sticky top-16 pr-4 xl:pr-6">
              <NavRail
                user={user}
                notificationCount={notificationCount}
                onLogout={handleLogout}
              />
            </div>
          </aside>

          {/* Center feed */}
          <main className="min-w-0 flex-1 pt-4 pb-36 lg:pl-6 lg:pr-0 lg:pt-6 lg:pb-16">
            <div className="w-full max-w-[600px] mx-auto lg:mx-0 px-4 lg:px-6">{children}</div>
          </main>

          {/* Right sidebar (desktop) */}
          <aside className="hidden shrink-0 lg:block lg:w-[280px] xl:w-[320px]">
            <div className="sticky top-16 py-6 pl-6">
              <RightSidebar user={user} />
            </div>
          </aside>
        </div>

        <BottomTabBar notificationCount={notificationCount} />
      </div>
    </DashboardProvider>
  );
}
