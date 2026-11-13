interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-2xl">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold tracking-tight text-ink">
        {title}
      </h3>
      <p className="mb-5 max-w-sm text-sm leading-relaxed text-ink-mute">
        {description}
      </p>
      {action}
    </div>
  );
}
