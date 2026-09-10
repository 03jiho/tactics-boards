import type { Team } from "@/types/football";

interface TeamBadgeProps {
  team: Team;
  /** Tailwind 크기 클래스, 예: "h-10 w-10" */
  sizeClassName?: string;
  textSizeClassName?: string;
}

/**
 * 구단 엠블럼 배지. crestUrl이 있으면 이미지를, 없으면 팀 컬러의 이니셜 배지를 보여준다.
 * 원본 엠블럼의 해상도·종횡비가 제각각이라, 정사각형 컨테이너 + object-contain으로 시각적 크기를 통일한다.
 */
export function TeamBadge({
  team,
  sizeClassName = "h-10 w-10",
  textSizeClassName = "text-sm",
}: TeamBadgeProps) {
  if (team.crestUrl) {
    return (
      <span
        className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-full bg-white p-1 ring-1 ring-zinc-200 dark:bg-zinc-100 dark:ring-zinc-700`}
        aria-hidden
      >
        {/* 구단 엠블럼은 출처가 제각각인 정적 이미지라 next/image 최적화 대상에서 제외한다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={team.crestUrl}
          alt=""
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-full font-bold text-white ${textSizeClassName}`}
      style={{ backgroundColor: team.accentColor }}
      aria-hidden
    >
      {team.name.slice(0, 1)}
    </span>
  );
}
