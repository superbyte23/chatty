import { Icon, type IconName } from "./icons";

type ToastTone = "success" | "danger" | "info";

interface ToastProps {
  tone?: ToastTone;
  title: string;
  description?: string;
  icon?: IconName;
}

const toneMap: Record<ToastTone, { wrap: string; icon: IconName }> = {
  success: { wrap: "bg-success-soft text-success", icon: "check" },
  danger: { wrap: "bg-danger-soft text-danger", icon: "x" },
  info: { wrap: "bg-accent-soft text-accent", icon: "sparkles" },
};

export default function Toast({
  tone = "success",
  title,
  description,
  icon,
}: ToastProps) {
  const meta = toneMap[tone];

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl bg-elevated/90 p-4 shadow-pop ring-1 ring-line-soft backdrop-blur-xl animate-rise"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.wrap}`}
      >
        <Icon name={icon ?? meta.icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-mute">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
