"use client";

import { Icon } from "./icons";

const STORAGE_KEY = "kcc-theme";

/**
 * Light / dark switch driven entirely by the CSS tokens declared in
 * `globals.css`. The `dark` class lives on <html>, so every token flips at once.
 */
export default function ThemeToggle({
  className = "",
  label = "Toggle dark mode",
}: {
  className?: string;
  label?: string;
}) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage can be unavailable in sandboxed frames — ignore
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`icon-btn ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon name="sun" className="h-5 w-5 dark:hidden" />
      <Icon name="moon" className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
