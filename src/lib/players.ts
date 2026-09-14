import { PITCH_TEMPLATES, type PositionTemplate } from "@/data/pitchTemplates";
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

type SlotRole = "gk" | "cb" | "wideDefender" | "pivot" | "wideAttacker" | "striker" | "other";

/**
 * 포지션 라벨이 아니라 템플릿 좌표의 기하학적 특징만으로 슬롯의 역할을 분류한다.
 * 포메이션마다 같은 라벨(RCM 등)이라도 실제 역할이 다르고(예: 4-4-2의 와이드 RCM vs 중앙 RCM),
 * 좌표 기반 분류를 쓰면 포메이션에 상관없이 일관되게 적용할 수 있다.
 * - wideDefender: 좌우로 많이 벌어져 있고(diff>=18) 비소유 시 낮은 위치(y<40) — 풀백/윙백
 * - wideAttacker: 좌우로 많이 벌어져 있고 비소유 시에도 높은 위치(y>=40) — 윙어/와이드 미드필더
 * - pivot: 중앙에 가깝고(diff<18) 소유 시 y가 28~50 사이 — 단일/더블 피봇
 * - striker: 소유 시 y>=84인 최전방 슬롯
 * - cb: 중앙에 가깝고 소유 시 y<28 — 센터백
 */
function classifySlot(slot: PositionTemplate): SlotRole {
  if (slot.positionLabel === "GK") return "gk";

  const xDiff = Math.abs(slot.inPossession.x - 50);
  const isWide = xDiff >= 18;

  if (slot.inPossession.y >= 84) return "striker";

  if (isWide) {
    return slot.outOfPossession.y < 40 ? "wideDefender" : "wideAttacker";
  }

  if (slot.inPossession.y < 28) return "cb";
  if (slot.inPossession.y >= 28 && slot.inPossession.y <= 50) return "pivot";
  return "other";
}

/**
 * 공유 포메이션 템플릿 좌표에 팀별 전술 스타일 보정을 적용해, 같은 포메이션이라도
 * 팀마다 다른 라인 높이/폭/역할별 움직임으로 보이게 한다.
 * - lineHeight/width: 전체 라인 높이와 진영 폭(모든 슬롯 공통).
 * - wingerTuck/fullbackInvert/anchorDrop/falseNine: 슬롯의 기하학적 역할(와이드 공격수,
 *   풀백/윙백, 피봇, 스트라이커)에 따라 추가로 적용되는 역할별 보정. 비소유 시에는 40% 강도로만
 *   반영해, 소유/비소유 두 국면이 팀마다 다르게 보이도록 한다.
 */
function applyTacticalStyle(
  coord: PitchCoordinate,
  style: TacticalStyle,
  role: SlotRole,
  phase: "in" | "out",
): PitchCoordinate {
  const isGoalkeeper = role === "gk";
  const depthWeight = isGoalkeeper ? 0.3 : clamp(1 - (coord.y / 100) * 0.6, 0.35, 1);
  const heightGain = phase === "out" ? 9 : 4.5;
  const widthGain = phase === "out" ? 0.22 : 0.12;

  let y = clamp(coord.y + style.lineHeight * heightGain * depthWeight, 3, 97);
  let x = isGoalkeeper ? coord.x : 50 + (coord.x - 50) * (1 + style.width * widthGain);

  const roleGain = phase === "in" ? 1 : 0.4;

  if (role === "wideDefender" && style.fullbackInvert) {
    const invert = style.fullbackInvert * roleGain;
    x = 50 + (x - 50) * (1 - invert * 0.35);
    y = y - invert * 10;
  } else if (role === "wideAttacker" && style.wingerTuck) {
    const tuck = style.wingerTuck * roleGain;
    x = 50 + (x - 50) * (1 - tuck * 0.35);
  } else if (role === "pivot" && style.anchorDrop) {
    const drop = style.anchorDrop * roleGain;
    y = y - drop * 14;
    x = 50 + (x - 50) * (1 + drop * 0.15);
  } else if (role === "striker" && style.falseNine) {
    const drop = style.falseNine * roleGain;
    y = y - drop * 20;
  }

  return { x: clamp(x, 3, 97), y: clamp(y, 3, 97) };
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
    const role = classifySlot(slot);
    return {
      playerId: roster[index].id,
      name: roster[index].name,
      number: roster[index].number ?? slot.number,
      positionLabel: slot.positionLabel,
      inPossession: applyTacticalStyle(slot.inPossession, style, role, "in"),
      outOfPossession: applyTacticalStyle(slot.outOfPossession, style, role, "out"),
    };
  });
}
