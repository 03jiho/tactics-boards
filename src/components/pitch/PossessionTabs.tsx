import type { PossessionPhase } from "@/types/football";

interface PossessionTabsProps {
  phase: PossessionPhase;
  onChange: (phase: PossessionPhase) => void;
}

const TABS: { id: PossessionPhase; label: string }[] = [
  { id: "in-possession", label: "공 소유 시" },
  { id: "out-of-possession", label: "공 미소유 시" },
];

export function PossessionTabs({ phase, onChange }: PossessionTabsProps) {
  return (
    <div className="inline-flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist">
      {TABS.map((tab) => {
        const isActive = tab.id === phase;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
