export function timeAgo(value: string | Date, addSuffix = true): string {
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  let label: string;
  if (seconds < 45) {
    label = "just now";
  } else if (seconds < 90) {
    label = "1m";
  } else if (seconds < 3600) {
    label = `${Math.round(seconds / 60)}m`;
  } else if (seconds < 3600 * 1.5) {
    label = "1h";
  } else if (seconds < 86400) {
    label = `${Math.round(seconds / 3600)}h`;
  } else if (seconds < 86400 * 1.5) {
    label = "1d";
  } else if (seconds < 86400 * 7) {
    label = `${Math.round(seconds / 86400)}d`;
  } else if (seconds < 86400 * 30) {
    label = `${Math.round(seconds / (86400 * 7))}w`;
  } else {
    label = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  if (!addSuffix || label === "just now") return label;
  return label === "1m" || label === "1h" || label === "1d"
    ? `${label} ago`
    : `${label} ago`;
}
