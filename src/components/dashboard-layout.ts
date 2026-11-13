export const dashboardContainerClass = "mx-auto w-full max-w-[1208px]";

export const dashboardBodyClass = `${dashboardContainerClass} flex`;

export const dashboardTopBarClass = [
  dashboardContainerClass,
  "grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4",
  "lg:grid-cols-[88px_minmax(0,1fr)_280px] lg:px-0",
  "xl:grid-cols-[240px_minmax(0,1fr)_320px]",
].join(" ");

export const dashboardTopBarTitleClass =
  "flex min-w-0 items-center gap-3 lg:col-start-2 lg:px-6";

export const dashboardTopBarActionsClass =
  "flex shrink-0 items-center justify-end lg:col-start-3 lg:px-6";
