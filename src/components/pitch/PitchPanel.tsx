"use client";

import { useState } from "react";
import type { PlayerPosition, PossessionPhase } from "@/types/football";
import { PitchBoard } from "./PitchBoard";
import { PossessionTabs } from "./PossessionTabs";

interface PitchPanelProps {
  players: PlayerPosition[];
  accentColor: string;
}

export function PitchPanel({ players, accentColor }: PitchPanelProps) {
  const [phase, setPhase] = useState<PossessionPhase>("in-possession");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          포메이션 보드
        </h2>
        <PossessionTabs phase={phase} onChange={setPhase} />
      </div>
      <div className="mx-auto w-full max-w-sm">
        <PitchBoard players={players} phase={phase} accentColor={accentColor} />
      </div>
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        탭을 전환하면 선수 위치가 실시간으로 이동합니다. (공격 방향: 위쪽)
      </p>
    </div>
  );
}
