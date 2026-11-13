export default function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-on-brand shadow-[0_10px_22px_-12px_var(--c-brand)] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]" aria-hidden>
        <path
          d="M4 6.5h16v11H9.5L4.5 20.6V17.5H4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="8.6" cy="11.6" r="1" fill="currentColor" />
        <circle cx="12" cy="11.6" r="1" fill="currentColor" />
        <circle cx="15.4" cy="11.6" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
