import type { Formation, FormationId } from "@/types/football";

interface FormationFilterBarProps {
  formations: Formation[];
  selected: FormationId | "all";
  onSelect: (formationId: FormationId | "all") => void;
  countByFormation: Record<string, number>;
}

export function FormationFilterBar({
  formations,
  selected,
  onSelect,
  countByFormation,
}: FormationFilterBarProps) {
  const totalCount = Object.values(countByFormation).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="포메이션 필터">
      <FilterChip
        label="전체"
        count={totalCount}
        isActive={selected === "all"}
        onClick={() => onSelect("all")}
      />
      {formations.map((formation) => (
        <FilterChip
          key={formation.id}
          label={formation.name}
          count={countByFormation[formation.id] ?? 0}
          isActive={selected === formation.id}
          onClick={() => onSelect(formation.id)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-xs ${
          isActive ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
