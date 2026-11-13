/**
 * Skeleton loaders replace every spinner in the app. The shimmer animation is
 * defined once in `globals.css` (`--animate-shimmer`).
 */
export default function LoadingSpinner({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: "h-4 w-24",
    md: "h-6 w-40",
    lg: "h-10 w-64",
  };

  return (
    <div
      className="flex items-center justify-center py-10"
      role="status"
      aria-label="Loading"
    >
      <div className={`skeleton ${sizeMap[size]}`} />
    </div>
  );
}
