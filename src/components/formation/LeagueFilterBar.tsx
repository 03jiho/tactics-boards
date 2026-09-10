import { FilterChip } from "@/components/common/FilterChip";

interface LeagueFilterBarProps {
  leagues: string[];
  selected: string | "all";
  onSelect: (league: string | "all") => void;
  countByLeague: Record<string, number>;
  koreanPlayerCount: number;
  koreanOnly: boolean;
  onToggleKoreanOnly: () => void;
}

export function LeagueFilterBar({
  leagues,
  selected,
  onSelect,
  countByLeague,
  koreanPlayerCount,
  koreanOnly,
  onToggleKoreanOnly,
}: LeagueFilterBarProps) {
  const totalCount = Object.values(countByLeague).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="리그 필터">
        <FilterChip
          label="전체 리그"
          count={totalCount}
          isActive={selected === "all"}
          onClick={() => onSelect("all")}
        />
        {leagues.map((league) => (
          <FilterChip
            key={league}
            label={league}
            count={countByLeague[league] ?? 0}
            isActive={selected === league}
            onClick={() => onSelect(league)}
          />
        ))}
      </div>

      <button
        type="button"
        aria-pressed={koreanOnly}
        onClick={onToggleKoreanOnly}
        className={`flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          koreanOnly
            ? "border-sky-600 bg-sky-600 text-white dark:border-sky-500 dark:bg-sky-500"
            : "border-zinc-200 text-zinc-600 hover:border-sky-300 hover:bg-sky-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <span aria-hidden>🇰🇷</span>
        한국 선수 소속 클럽
        <span
          className={`rounded-full px-1.5 text-xs ${
            koreanOnly ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          {koreanPlayerCount}
        </span>
      </button>
    </div>
  );
}
