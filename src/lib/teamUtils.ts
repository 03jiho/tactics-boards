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

/**
 * 카카오톡 링크 카드는 설명을 두 줄(약 80자)까지만 보여준다. 한 줄 요약 전체를 넣으면
 * 리그·감독·포메이션만 남고 팀을 구분해 주는 뒷부분이 잘려 나가므로, 예산 안에 들어가는
 * 문장까지만 담는다. 문장 중간에서 끊지 않아야 "…재편되는 것이 원칙인" 같은 토막이 안 남는다.
 */
export const SHARE_DESCRIPTION_BUDGET = 80;

export function buildShareDescription(shortSummary: string): string {
  const sentences = shortSummary.split(/(?<=\.)\s+/).filter(Boolean);
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > SHARE_DESCRIPTION_BUDGET) break;
    out = next;
  }
  // 첫 문장부터 예산을 넘으면 어쩔 수 없이 그 문장을 그대로 쓴다.
  return out || (sentences[0] ?? shortSummary);
}
