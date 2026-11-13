"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { Icon, type IconName } from "@/components/icons";
import { SkeletonNotification } from "@/components/Skeleton";
import { apiFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import PageLayout from "@/components/PageLayout";

interface Notification {
  id: string;
  type: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

const typeMeta: Record<string, { icon: IconName; classes: string }> = {
  like: { icon: "heart", classes: "bg-accent-soft text-accent" },
  comment: { icon: "comment", classes: "bg-accent-soft text-accent" },
  follow: { icon: "user", classes: "bg-success-soft text-success" },
  message: { icon: "message", classes: "bg-muted text-ink-soft" },
};

const fallbackMeta = {
  icon: "bell" as IconName,
  classes: "bg-muted text-ink-mute",
};

function groupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const time = date.getTime();
  if (time >= startOfToday) return "Today";
  if (time >= startOfYesterday) return "Yesterday";
  return "Earlier";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await apiFetch("/api/notifications", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  const groups = notifications.reduce<Record<string, Notification[]>>(
    (acc, notif) => {
      const key = groupLabel(notif.createdAt);
      (acc[key] ||= []).push(notif);
      return acc;
    },
    {}
  );

  return (
    <PageLayout>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-ink-mute">
            {unread > 0 ? (
              <>
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-accent"
                />
                You have {unread} unread notification{unread > 1 ? "s" : ""}
              </>
            ) : (
              <>
                <Icon name="check" className="h-4 w-4 text-success" />
                You&apos;re all caught up
              </>
            )}
          </p>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="btn btn-ghost px-4 py-2 text-xs"
            >
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <SkeletonNotification />
            <SkeletonNotification />
            <SkeletonNotification />
            <SkeletonNotification />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            description="When someone likes your post, comments, or follows you, you'll see it here."
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(groups).map(([label, items]) => (
              <section key={label} className="space-y-3">
                <h2 className="px-1 text-2xs font-semibold tracking-wide text-ink-mute uppercase">
                  {label}
                </h2>
                <div className="space-y-2">
                  {items.map((notif) => {
                    const meta = typeMeta[notif.type] ?? fallbackMeta;
                    return (
                      <Link
                        key={notif.id}
                        href={notif.link || "#"}
                        className={`card card-hover flex items-start gap-3 p-4 ${
                          notif.isRead ? "" : "bg-accent-soft/50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.classes}`}
                        >
                          <Icon name={meta.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              notif.isRead
                                ? "text-ink-soft"
                                : "font-semibold text-ink"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <p className="mt-1 text-xs text-ink-mute">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <span
                            aria-label="Unread"
                            className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
