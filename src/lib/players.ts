import { PITCH_TEMPLATES } from "@/data/pitchTemplates";
import type { FormationId, PitchCoordinate, PlayerPosition, TacticalStyle } from "@/types/football";

export interface RosterEntry {
  id: string;
  name: string;
  /** 실제 등번호. 생략하면 포메이션 템플릿의 기본 등번호를 사용한다. */
  number?: number;
}

const NEUTRAL_STYLE: TacticalStyle = { lineHeight: 0, width: 0 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 공유 포메이션 템플릿 좌표에 팀별 lineHeight/width 보정을 적용해, 같은 포메이션이라도
 * 팀마다 다른 라인 높이/폭으로 보이게 한다.
 * - lineHeight: 값이 클수록 전체 라인이 상대 골문 쪽으로 전진한다. 자기 골문에 가까운(낮은 y)
 *   수비 라인일수록 영향을 크게 받고, 최전방으로 갈수록 영향이 줄어든다.
 * - width: 값이 클수록 중앙(x=50)에서 좌우로 더 벌어지고, 값이 작을수록(음수) 압축된다.
 *   골키퍼는 위치 특성상 폭 보정에서 제외한다.
 */
function applyTacticalStyle(
  coord: PitchCoordinate,
  style: TacticalStyle,
  isGoalkeeper: boolean,
  phase: "in" | "out",
): PitchCoordinate {
  const depthWeight = isGoalkeeper ? 0.3 : clamp(1 - (coord.y / 100) * 0.6, 0.35, 1);
  const heightGain = phase === "out" ? 9 : 4.5;
  const widthGain = phase === "out" ? 0.22 : 0.12;

  const y = clamp(coord.y + style.lineHeight * heightGain * depthWeight, 3, 97);
  const x = isGoalkeeper
    ? coord.x
    : clamp(50 + (coord.x - 50) * (1 + style.width * widthGain), 3, 97);

  return { x, y };
}

/**
 * 포메이션 템플릿의 좌표 슬롯에 실제 선수 명단을 채워 넣는다.
 * roster는 반드시 PITCH_TEMPLATES[formationId]와 같은 순서(GK -> DF -> MF -> FW)로 전달해야 한다.
 * style을 지정하면 같은 포메이션을 쓰는 다른 팀과 구분되도록 좌표에 팀별 보정을 적용한다.
 */
export function buildPlayers(
  formationId: FormationId,
  roster: RosterEntry[],
  style: TacticalStyle = NEUTRAL_STYLE,
): PlayerPosition[] {
  const template = PITCH_TEMPLATES[formationId];
  if (roster.length !== template.length) {
    throw new Error(
      `roster length(${roster.length}) does not match "${formationId}" template length(${template.length})`,
    );
  }

  return template.map((slot, index) => {
    const isGoalkeeper = slot.positionLabel === "GK";
    return {
      playerId: roster[index].id,
      name: roster[index].name,
      number: roster[index].number ?? slot.number,
      positionLabel: slot.positionLabel,
      inPossession: applyTacticalStyle(slot.inPossession, style, isGoalkeeper, "in"),
      outOfPossession: applyTacticalStyle(slot.outOfPossession, style, isGoalkeeper, "out"),
    };
  });
}
