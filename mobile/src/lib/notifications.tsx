import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface NotificationsState {
  unread: number;
  setUnread: (count: number) => void;
}

const NotificationsContext = createContext<NotificationsState>({
  unread: 0,
  setUnread: () => {},
});

/**
 * Shares the unread notification count with the top bar so the alerts entry
 * point can live outside the bottom tab bar.
 */
export function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [unread, setUnread] = useState(0);
  const value = useMemo(() => ({ unread, setUnread }), [unread]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
