import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
            TB
          </span>
          Tactics Board
        </Link>
        <p className="hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">
          포메이션별 해외축구 전술 탐색
        </p>
      </div>
    </header>
  );
}
