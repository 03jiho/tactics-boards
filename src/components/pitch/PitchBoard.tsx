import type { PlayerPosition, PossessionPhase } from "@/types/football";
import { PlayerToken } from "./PlayerToken";

interface PitchBoardProps {
  players: PlayerPosition[];
  phase: PossessionPhase;
  accentColor: string;
}

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 150;

/** 데이터 좌표(0~100, 자기 골라인~상대 골라인)를 뷰박스 좌표로 변환한다. 공격 방향은 위쪽. */
function toViewCoordinate(x: number, y: number) {
  return {
    cx: x,
    cy: VIEW_HEIGHT - (y / 100) * VIEW_HEIGHT,
  };
}

export function PitchBoard({ players, phase, accentColor }: PitchBoardProps) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-auto w-full rounded-lg bg-emerald-600"
      role="img"
      aria-label={
        phase === "in-possession" ? "공 소유 시 포메이션" : "공 미소유 시 포메이션"
      }
    >
      {/* 경기장 줄무늬 배경 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x={0}
          y={(VIEW_HEIGHT / 8) * i}
          width={VIEW_WIDTH}
          height={VIEW_HEIGHT / 8}
          fill={i % 2 === 0 ? "rgba(255,255,255,0.035)" : "transparent"}
        />
      ))}

      {/* 필드 라인 */}
      <g stroke="rgba(255,255,255,0.75)" strokeWidth={0.5} fill="none">
        <rect x={2} y={2} width={VIEW_WIDTH - 4} height={VIEW_HEIGHT - 4} />
        <line x1={2} y1={VIEW_HEIGHT / 2} x2={VIEW_WIDTH - 2} y2={VIEW_HEIGHT / 2} />
        <circle cx={VIEW_WIDTH / 2} cy={VIEW_HEIGHT / 2} r={11} />
        <circle cx={VIEW_WIDTH / 2} cy={VIEW_HEIGHT / 2} r={0.6} fill="rgba(255,255,255,0.75)" />

        {/* 하단(자기 진영) 페널티 박스 */}
        <rect x={22} y={2} width={56} height={22} />
        <rect x={38} y={2} width={24} height={9} />
        <path d={`M 40 24 A 11 11 0 0 0 60 24`} />

        {/* 상단(상대 진영) 페널티 박스 */}
        <rect x={22} y={VIEW_HEIGHT - 24} width={56} height={22} />
        <rect x={38} y={VIEW_HEIGHT - 11} width={24} height={9} />
        <path d={`M 40 ${VIEW_HEIGHT - 24} A 11 11 0 0 1 60 ${VIEW_HEIGHT - 24}`} />
      </g>

      {/* 선수 토큰 */}
      {players.map((player) => {
        const coord = phase === "in-possession" ? player.inPossession : player.outOfPossession;
        const { cx, cy } = toViewCoordinate(coord.x, coord.y);
        return (
          <PlayerToken
            key={player.playerId}
            x={cx}
            y={cy}
            number={player.number}
            name={player.name}
            positionLabel={player.positionLabel}
            accentColor={accentColor}
          />
        );
      })}
    </svg>
  );
}
