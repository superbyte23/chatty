import Link from "next/link";
import BrandMark from "./BrandMark";
import { Icon, type IconName } from "./icons";

interface AuthShellProps {
  children: React.ReactNode;
}

const features: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "sparkles",
    title: "Connect with your campus",
    desc: "Share moments, ideas and updates with fellow KCC students.",
  },
  {
    icon: "users",
    title: "Discover new people",
    desc: "Find classmates and friends across every department.",
  },
  {
    icon: "message",
    title: "Chat in real time",
    desc: "Message anyone directly — instantly and privately.",
  },
];

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-2 p-12 text-on-brand lg:flex xl:w-1/2">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />

        <Link href="/" className="relative flex items-center gap-3">
          <BrandMark className="h-11 w-11 bg-white/15 shadow-none" />
          <div>
            <p className="text-xl font-semibold tracking-tight">KCC Chat</p>
            <p className="text-xs font-semibold text-on-brand/70">
              Kingsborough Community College
            </p>
          </div>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Where KCC students connect.
          </h2>
          <p className="mt-3 text-base text-on-brand/80">
            One home for campus updates, conversations, and new friends.
          </p>
          <ul className="mt-8 space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                  <Icon name={f.icon} className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="mt-0.5 text-sm text-on-brand/75">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-on-brand/70">
          © {new Date().getFullYear()} KCC Chat · Kingsborough Community College
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <BrandMark className="h-10 w-10" />
            <span className="text-xl font-semibold tracking-tight text-ink">
              KCC Chat
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
