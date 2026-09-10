import type { Formation, FormationId } from "@/types/football";
import { FilterChip } from "@/components/common/FilterChip";

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
