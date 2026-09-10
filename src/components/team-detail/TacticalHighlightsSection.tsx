interface TacticalHighlightsSectionProps {
  highlights: string[];
  reportSummary: string;
}

export function TacticalHighlightsSection({
  highlights,
  reportSummary,
}: TacticalHighlightsSectionProps) {
  return (
    <section className="rounded-xl bg-zinc-50 p-5 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        관전 포인트 (Key Tactical Points)
      </h2>
      <ol className="mt-3 space-y-2">
        {highlights.map((highlight, index) => (
          <li key={highlight} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {index + 1}
            </span>
            {highlight}
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-zinc-200 pt-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
        {reportSummary}
      </p>
    </section>
  );
}
