import Link from "next/link";
import type { Formation, Team } from "@/types/football";
import { TeamBadge } from "@/components/team/TeamBadge";

interface TeamHeaderProps {
  team: Team;
  formation: Formation;
}

export function TeamHeader({ team, formation }: TeamHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <TeamBadge team={team} sizeClassName="h-14 w-14" textSizeClassName="text-lg" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {team.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {team.league} · {team.country} · 감독 {team.manager}
          </p>
        </div>
      </div>

      <Link
        href={`/?formation=${formation.id}`}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        주 포메이션 {formation.name}
        <span className="text-zinc-400">({formation.nickname})</span>
      </Link>
    </div>
  );
}
