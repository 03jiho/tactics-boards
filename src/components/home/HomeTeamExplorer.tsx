"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormationFilterBar } from "@/components/formation/FormationFilterBar";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamTable } from "@/components/team/TeamTable";
import { TeamListControls, type TeamListView } from "@/components/team/TeamListControls";
import { filterAndSortTeams } from "@/lib/teamUtils";
import type { Formation, FormationId, Team, TeamSortKey } from "@/types/football";

interface HomeTeamExplorerProps {
  teams: Team[];
  formations: Formation[];
}

function isFormationId(value: string | null, formations: Formation[]): value is FormationId {
  return formations.some((formation) => formation.id === value);
}

export function HomeTeamExplorer({ teams, formations }: HomeTeamExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFormation = searchParams.get("formation");
  const [formationId, setFormationId] = useState<FormationId | "all">(
    isFormationId(initialFormation, formations) ? initialFormation : "all",
  );
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<TeamSortKey>("name");
  const [view, setView] = useState<TeamListView>("card");

  const countByFormation = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const team of teams) {
      counts[team.primaryFormationId] = (counts[team.primaryFormationId] ?? 0) + 1;
    }
    return counts;
  }, [teams]);

  const visibleTeams = useMemo(
    () => filterAndSortTeams(teams, { formationId, query, sortKey }),
    [teams, formationId, query, sortKey],
  );

  function handleSelectFormation(next: FormationId | "all") {
    setFormationId(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      params.delete("formation");
    } else {
      params.set("formation", next);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
  }

  return (
    <div className="flex flex-col gap-6">
      <FormationFilterBar
        formations={formations}
        selected={formationId}
        onSelect={handleSelectFormation}
        countByFormation={countByFormation}
      />

      <TeamListControls
        query={query}
        onQueryChange={setQuery}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        view={view}
        onViewChange={setView}
      />

      {visibleTeams.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          조건에 맞는 팀이 없습니다. 검색어나 필터를 조정해 보세요.
        </p>
      ) : view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <TeamTable teams={visibleTeams} />
      )}
    </div>
  );
}
