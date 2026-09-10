import type { TeamSortKey } from "@/types/football";

export type TeamListView = "card" | "table";

interface TeamListControlsProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortKey: TeamSortKey;
  onSortKeyChange: (sortKey: TeamSortKey) => void;
  view: TeamListView;
  onViewChange: (view: TeamListView) => void;
}

const SORT_OPTIONS: { value: TeamSortKey; label: string }[] = [
  { value: "name", label: "팀명순" },
  { value: "league", label: "리그순" },
  { value: "manager", label: "감독명순" },
];

export function TeamListControls({
  query,
  onQueryChange,
  sortKey,
  onSortKeyChange,
  view,
  onViewChange,
}: TeamListControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="팀명, 리그, 감독명으로 검색"
        className="w-full max-w-xs rounded-lg border border-zinc-200 px-3.5 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
      />

      <div className="flex items-center gap-2">
        <select
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value as TeamSortKey)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
          <ViewToggleButton
            label="카드"
            isActive={view === "card"}
            onClick={() => onViewChange("card")}
          />
          <ViewToggleButton
            label="테이블"
            isActive={view === "table"}
            onClick={() => onViewChange("table")}
          />
        </div>
      </div>
    </div>
  );
}

function ViewToggleButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
