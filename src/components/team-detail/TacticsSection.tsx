import type { TacticalDetail } from "@/types/football";

interface TacticsSectionProps {
  tactical: TacticalDetail;
}

function KeyPointList({ points }: { points: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {points.map((point) => (
        <li key={point} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
          {point}
        </li>
      ))}
    </ul>
  );
}

export function TacticsSection({ tactical }: TacticsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
          공 소유 시 (In Possession)
        </span>
        <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {tactical.inPossession.summary}
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {tactical.inPossession.buildUpDescription}
        </p>
        <KeyPointList points={tactical.inPossession.keyPoints} />
      </section>

      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
          공 미소유 시 (Out of Possession)
        </span>
        <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {tactical.outOfPossession.summary}
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {tactical.outOfPossession.defensiveShapeDescription}
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {tactical.outOfPossession.pressingDescription}
        </p>
        <KeyPointList points={tactical.outOfPossession.keyPoints} />
      </section>
    </div>
  );
}
