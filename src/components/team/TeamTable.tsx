import Link from "next/link";
import type { Team } from "@/types/football";
import { TeamBadge } from "./TeamBadge";

export function TeamTable({ teams }: { teams: Team[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">팀명</th>
            <th className="px-4 py-3 font-medium">리그</th>
            <th className="px-4 py-3 font-medium">감독</th>
            <th className="px-4 py-3 font-medium">포메이션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {teams.map((team) => (
            <tr key={team.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <td className="px-4 py-3">
                <Link href={`/teams/${team.id}`} className="flex items-center gap-2.5 font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                  <TeamBadge team={team} sizeClassName="h-7 w-7" textSizeClassName="text-xs" />
                  {team.name}
                  {team.koreanPlayer && <span aria-label="한국 선수 소속">🇰🇷</span>}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{team.league}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{team.manager}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {team.primaryFormationId}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
