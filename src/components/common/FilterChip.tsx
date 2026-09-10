interface FilterChipProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function FilterChip({ label, count, isActive, onClick }: FilterChipProps) {
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
