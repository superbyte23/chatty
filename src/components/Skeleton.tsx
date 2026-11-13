/**
 * Reusable skeleton shapes for loading states.
 * The shimmer animation lives in `globals.css` (`--animate-shimmer`).
 */

export function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`skeleton h-3 ${className}`} />;
}

export function SkeletonPost() {
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-2.5 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-11/12" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="skeleton h-9 w-16 rounded-full" />
        <div className="skeleton h-9 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonUserCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-32" />
          <div className="skeleton h-2.5 w-24" />
          <div className="skeleton h-2.5 w-full" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonConversation() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-2.5 w-48" />
      </div>
    </div>
  );
}

export function SkeletonNotification() {
  return (
    <div className="card flex items-start gap-3 p-4">
      <div className="skeleton h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-2.5 w-16" />
      </div>
    </div>
  );
}

export function SkeletonMessage({ own = false }: { own?: boolean }) {
  return (
    <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
      <div
        className={`skeleton h-10 ${own ? "w-40" : "w-56"} rounded-2xl`}
      />
    </div>
  );
}
