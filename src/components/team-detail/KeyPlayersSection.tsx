import type { KeyPlayer } from "@/types/football";

interface KeyPlayersSectionProps {
  keyPlayers: KeyPlayer[];
  accentColor: string;
}

export function KeyPlayersSection({ keyPlayers, accentColor }: KeyPlayersSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        핵심 선수 (Key Players)
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {keyPlayers.map((player) => (
          <div
            key={player.playerId}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {player.number ?? player.name.slice(0, 1)}
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {player.name}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {player.role}
            </p>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300">
              {player.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
