"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import { Icon } from "@/components/icons";
import { SkeletonConversation, SkeletonMessage } from "@/components/Skeleton";
import { apiFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  year: string;
}

interface Conversation {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  otherUserOnline: boolean;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  senderName: string;
  senderAvatar: string | null;
}

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

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await apiFetch("/api/messages");
      if (res.ok) setConversations(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await apiFetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const [convsRes, meRes] = await Promise.all([
          apiFetch("/api/messages"),
          apiFetch("/api/auth/me"),
        ]);
        if (active) {
          if (convsRes.ok) setConversations(await convsRes.json());
          if (meRes.ok) setCurrentUserId((await meRes.json()).id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!showNewMessageModal) return;
    let active = true;
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await apiFetch("/api/users");
        if (active && res.ok) setUsers(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setUsersLoading(false);
      }
    };
    loadUsers();
    return () => {
      active = false;
    };
  }, [showNewMessageModal]);

  const fetchMessages = async (userId: string) => {
    setMessagesLoading(true);
    try {
      const res = await apiFetch(`/api/messages/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMessagesLoading(false);
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedUser(conv);
    fetchMessages(conv.otherUserId);
  };

  const handleNewConversation = async (userId: string) => {
    setShowNewMessageModal(false);
    // Find or create conversation with this user
    try {
      const res = await apiFetch(`/api/messages/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedUser({
          id: data.id || `conv-${userId}`,
          content: "",
          createdAt: new Date().toISOString(),
          isRead: true,
          senderId: currentUserId,
          receiverId: userId,
          otherUserId: userId,
          otherUserName: users.find(u => u.id === userId)?.name || "Unknown",
          otherUserAvatar: users.find(u => u.id === userId)?.avatarUrl || "",
          otherUserOnline: false,
          unreadCount: 0,
        });
        fetchMessages(userId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedUser) return;
    setSending(true);

    try {
      const res = await apiFetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          receiverId: selectedUser.otherUserId,
          content: newMessage,
        }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            senderName: "You",
            senderAvatar: null,
          },
        ]);
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const groups = conversations.reduce<Record<string, Conversation[]>>(
    (acc, conv) => {
      const key = groupLabel(conv.createdAt);
      (acc[key] ||= []).push(conv);
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="card flex h-[calc(100dvh-14rem)] min-h-[22rem] overflow-hidden lg:h-[calc(100dvh-10rem)]">
      {/* Conversations list */}
      <div
        className={`w-full flex-col border-r border-line-soft sm:flex sm:w-80 ${
          selectedUser ? "hidden" : "flex"
        }`}
      >
        <div className="flex-1 overflow-y-auto relative">
          {/* Floating action button for new message */}
          <button
            type="button"
            onClick={() => setShowNewMessageModal(true)}
            className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-on-accent shadow-float transition-all duration-200 ease-soft hover:bg-accent-strong hover:shadow-pop active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label="New message"
          >
            <Icon name="plus" className="h-6 w-6" />
          </button>
          {loading ? (
            <div className="space-y-1 p-2">
              <SkeletonConversation />
              <SkeletonConversation />
              <SkeletonConversation />
              <SkeletonConversation />
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No messages yet"
              description="Start a conversation with someone from the Explore page!"
            />
          ) : (
            Object.entries(groups).map(([label, items]) => (
              <section key={label}>
                <h2 className="sticky top-0 z-10 bg-elevated/85 px-4 py-2 text-2xs font-semibold tracking-wide text-ink-mute uppercase backdrop-blur-xl">
                  {label}
                </h2>
                <div className="px-2 pb-2">
                  {items.map((conv) => {
                    const isSelected =
                      selectedUser?.otherUserId === conv.otherUserId;
                    const unread = conv.unreadCount > 0;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => selectConversation(conv)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 ${
                          isSelected
                            ? "bg-accent-soft"
                            : unread
                              ? "bg-accent-soft/40 hover:bg-accent-soft"
                              : "hover:bg-muted"
                        }`}
                      >
                        <Avatar
                          name={conv.otherUserName}
                          src={conv.otherUserAvatar}
                          size="md"
                          isOnline={conv.otherUserOnline}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-sm ${
                                unread
                                  ? "font-semibold text-ink"
                                  : "font-normal text-ink-soft"
                              }`}
                            >
                              {conv.otherUserName}
                            </p>
                            <span className="shrink-0 text-2xs text-ink-mute">
                              {formatDistanceToNow(new Date(conv.createdAt), {
                                addSuffix: false,
                              })}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-xs ${
                                unread ? "text-ink-soft" : "text-ink-mute"
                              }`}
                            >
                              {conv.senderId === currentUserId && "You: "}
                              {conv.content}
                            </p>
                            {unread && (
                              <span className="flex shrink-0 items-center gap-1.5">
                                <span
                                  aria-hidden
                                  className="h-2 w-2 rounded-full bg-accent"
                                />
                                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-on-accent tabular-nums">
                                  {conv.unreadCount}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Message thread */}
      <div
        className={`flex-1 flex-col ${
          !selectedUser ? "hidden sm:flex" : "flex"
        }`}
      >
        {!selectedUser ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon="💬"
              title="Select a conversation"
              description="Choose a conversation from the list to start chatting."
            />
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 border-b border-line-soft bg-elevated/70 px-4 py-3 backdrop-blur-xl">
              <button
                onClick={() => setSelectedUser(null)}
                className="icon-btn h-10 w-10 sm:hidden"
                aria-label="Back to conversations"
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <Avatar
                name={selectedUser.otherUserName}
                src={selectedUser.otherUserAvatar}
                size="sm"
                isOnline={selectedUser.otherUserOnline}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {selectedUser.otherUserName}
                </p>
                <p
                  className={`text-xs ${
                    selectedUser.otherUserOnline
                      ? "text-success"
                      : "text-ink-mute"
                  }`}
                >
                  {selectedUser.otherUserOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-sunken/50 p-4">
              {messagesLoading ? (
                <div className="space-y-3">
                  <SkeletonMessage />
                  <SkeletonMessage own />
                  <SkeletonMessage />
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isOwn
                            ? "rounded-br-md bg-accent text-on-accent"
                            : "rounded-bl-md bg-elevated text-ink-soft ring-1 ring-line-soft"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`mt-1 text-2xs ${
                            isOwn ? "text-on-accent/70" : "text-ink-mute"
                          }`}
                        >
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-line-soft bg-elevated/70 p-3 backdrop-blur-xl"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                aria-label="Type a message"
                className="input min-h-11 flex-1"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_8px_18px_-10px_var(--c-accent)] transition-all duration-200 ease-soft hover:bg-accent-strong disabled:pointer-events-none disabled:opacity-40 active:scale-95"
                aria-label="Send message"
              >
                <Icon name="send" className="h-[18px] w-[18px]" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>

    {/* New Message Modal */}
    {showNewMessageModal && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4"
        onClick={() => setShowNewMessageModal(false)}
      >
        <div
          className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New message"
          className="relative w-full max-w-md animate-rise"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-t-3xl bg-elevated p-4 shadow-pop ring-1 ring-line-soft sm:rounded-3xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight text-ink">
                New message
              </h2>
              <button
                type="button"
                onClick={() => setShowNewMessageModal(false)}
                className="icon-btn"
                aria-label="Close"
                title="Close"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="input min-h-11 w-full"
                autoFocus
              />
            </div>

            {usersLoading ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {users
                  .filter(
                    (u) =>
                      u.id !== currentUserId &&
                      u.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleNewConversation(user.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-muted"
                    >
                      <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-ink-mute">
                          {user.department} • {user.year}
                        </p>
                      </div>
                    </button>
                  ))}
                {users.length === 0 && (
                  <div className="py-8 text-center text-ink-mute">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
}
