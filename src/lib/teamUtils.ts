import type { FormationId, Team, TeamSortKey } from "@/types/football";

export interface TeamFilterOptions {
  formationId?: FormationId | "all";
  league?: string | "all";
  koreanOnly?: boolean;
  query?: string;
  sortKey?: TeamSortKey;
}

function matchesQuery(team: Team, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    team.name.toLowerCase().includes(normalized) ||
    team.league.toLowerCase().includes(normalized) ||
    team.manager.toLowerCase().includes(normalized)
  );
}

const SORT_COMPARATORS: Record<TeamSortKey, (a: Team, b: Team) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, "ko"),
  league: (a, b) => a.league.localeCompare(b.league, "ko"),
  manager: (a, b) => a.manager.localeCompare(b.manager, "ko"),
};

export function filterAndSortTeams(
  teams: Team[],
  {
    formationId = "all",
    league = "all",
    koreanOnly = false,
    query = "",
    sortKey = "name",
  }: TeamFilterOptions,
): Team[] {
  const filtered = teams.filter((team) => {
    const formationMatches =
      formationId === "all" || team.primaryFormationId === formationId;
    const leagueMatches = league === "all" || team.league === league;
    const koreanMatches = !koreanOnly || Boolean(team.koreanPlayer);
    return formationMatches && leagueMatches && koreanMatches && matchesQuery(team, query);
  });

  return [...filtered].sort(SORT_COMPARATORS[sortKey]);
}
