import { API_BASE_URL } from "./config";
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "./storage";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department: string;
  year: string;
  bio: string;
}

export interface AuthResponse extends SessionUser {
  token: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  authorDepartment: string | null;
  authorYear: string | null;
  likeCount: number;
  commentCount: number;
  userLiked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
  isOnline: boolean | null;
  postCount: number;
  followerCount: number;
  isFollowing: boolean;
}

export interface Profile extends PublicUser {
  createdAt: string;
  followingCount: number;
  isOwn: boolean;
}

export interface FollowListItem {
  id: string;
  name: string;
  avatarUrl: string | null;
  department: string | null;
  bio: string | null;
  isOnline: boolean | null;
}

export interface Conversation {
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

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  senderName: string;
  senderAvatar: string | null;
}

export interface ThreadData {
  messages: ChatMessage[];
  user: { id: string; name: string; avatarUrl: string | null; isOnline: boolean } | null;
}

export interface AppNotification {
  id: string;
  type: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsData {
  notifications: AppNotification[];
  unreadCount: number;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = await getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

async function parseError(res: Response): Promise<ApiError> {
  let message = "Something went wrong. Please try again.";
  try {
    const data = await res.json();
    if (typeof data?.error === "string") message = data.error;
  } catch {
    // non-JSON error body; keep default message
  }
  return new ApiError(message, res.status);
}

async function json<T>(res: Response | Promise<Response>): Promise<T> {
  const r = await res;
  if (!r.ok) throw await parseError(r);
  return r.json() as Promise<T>;
}

export function setAuthToken(token: string) {
  return setStoredToken(token);
}

export function clearAuth() {
  return clearStoredToken();
}

export const api = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    json<AuthResponse>(
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    ),

  register: (body: {
    name: string;
    email: string;
    password: string;
    department?: string;
    year?: string;
  }) =>
    json<AuthResponse>(
      apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      })
    ),

  me: () => json<SessionUser>(apiFetch("/api/auth/me")),

  logout: async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore server errors on logout
    }
  },

  // ─── Posts ───────────────────────────────────────────────────────────────
  getPosts: (userId?: string) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    return json<Post[]>(apiFetch(`/api/posts${qs}`));
  },

  getPost: (id: string) => json<Post>(apiFetch(`/api/posts/${id}`)),

  createPost: (content: string, imageUrl?: string) =>
    json<Post>(
      apiFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ content, imageUrl }),
      })
    ),

  updatePost: (id: string, content: string) =>
    json<Post>(
      apiFetch(`/api/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      })
    ),

  deletePost: async (id: string) => {
    const res = await apiFetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw await parseError(res);
  },

  toggleLike: async (postId: string): Promise<boolean> => {
    const data = await json<{ liked: boolean }>(
      apiFetch(`/api/posts/${postId}/like`, { method: "POST" })
    );
    return data.liked;
  },

  // ─── Comments ────────────────────────────────────────────────────────────
  getComments: (postId: string) =>
    json<Comment[]>(apiFetch(`/api/posts/${postId}/comments`)),

  addComment: (postId: string, content: string) =>
    json<Comment>(
      apiFetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      })
    ),

  // ─── Users & follow ──────────────────────────────────────────────────────
  getUsers: (q?: string) => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return json<PublicUser[]>(apiFetch(`/api/users${qs}`));
  },

  getUser: (id: string) => json<Profile>(apiFetch(`/api/users/${id}`)),

  updateProfile: (id: string, body: { name?: string; bio?: string; department?: string; year?: string }) =>
    json<SessionUser>(
      apiFetch(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      })
    ),

  toggleFollow: async (userId: string): Promise<boolean> => {
    const data = await json<{ following: boolean }>(
      apiFetch("/api/follow", {
        method: "POST",
        body: JSON.stringify({ userId }),
      })
    );
    return data.following;
  },

  getFollowList: (userId: string, type: "followers" | "following") =>
    json<FollowListItem[]>(
      apiFetch(`/api/follow?userId=${encodeURIComponent(userId)}&type=${type}`)
    ),

  // ─── Messages ────────────────────────────────────────────────────────────
  getConversations: () => json<Conversation[]>(apiFetch("/api/messages")),

  getThread: (userId: string) =>
    json<ThreadData>(apiFetch(`/api/messages/${userId}`)),

  sendMessage: (receiverId: string, content: string) =>
    json<ChatMessage>(
      apiFetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ receiverId, content }),
      })
    ),

  // ─── Notifications ───────────────────────────────────────────────────────
  getNotifications: () =>
    json<NotificationsData>(apiFetch("/api/notifications")),

  markNotificationsRead: async () => {
    const res = await apiFetch("/api/notifications", { method: "PUT" });
    if (!res.ok) throw await parseError(res);
  },
};
