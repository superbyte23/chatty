"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  /** Whether to constrain content width to 600px (for feed-like content) */
  constrained?: boolean;
  /** Additional top padding for pages with sticky search/filters */
  stickyTop?: boolean;
}

/**
 * Standardized page layout wrapper for dashboard pages.
 * Provides consistent spacing, horizontal padding, and content width constraints.
 *
 * Spacing scale (based on 4px grid):
 * - space-y-6 (24px) between major sections
 * - space-y-4 (16px) between items within a section
 * - px-4 (16px) horizontal padding on mobile
 * - lg:px-6 (24px) horizontal padding on desktop
 * - max-w-[600px] for constrained content (feed, profile posts, etc.)
 * - max-w-[720px] for wider content (explore grid, settings forms)
 */
export default function PageLayout({
  children,
  className = "",
  constrained = true,
  stickyTop = false,
}: PageLayoutProps) {
  return (
    <div
      className={`w-full ${constrained ? "max-w-[600px]" : "max-w-[720px]"} mx-auto px-4 lg:px-6 pt-4 lg:pt-6 pb-16 ${stickyTop ? "pt-16 lg:pt-20" : ""} ${className}`}
    >
      <div className="space-y-6">{children}</div>
    </div>
  );
}

/**
 * Section component for consistent spacing within pages.
 * Use for major content sections that need standard spacing.
 */
export function PageSection({
  children,
  className = "",
  tight = false,
}: { children: ReactNode; className?: string; tight?: boolean }) {
  return (
    <section className={`space-y-${tight ? "4" : "6"} ${className}`}>
      {children}
    </section>
  );
}

/**
 * Section header with consistent typography and spacing.
 */
export function SectionHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink-mute">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}