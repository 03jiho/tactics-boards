import Link from "next/link";
import type { Team } from "@/types/football";
import { TeamBadge } from "./TeamBadge";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
    >
      <div className="flex items-center gap-3">
        <TeamBadge team={team} />
        <div>
          <p className="font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
            {team.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{team.league}</p>
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">감독 {team.manager}</p>
      <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
        {team.shortSummary}
      </p>
      <span className="mt-auto inline-flex w-fit items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {team.primaryFormationId}
      </span>
    </Link>
  );
}
