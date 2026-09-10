import { PITCH_TEMPLATES } from "@/data/pitchTemplates";
import type { FormationId, PlayerPosition } from "@/types/football";

export interface RosterEntry {
  id: string;
  name: string;
  /** 실제 등번호. 생략하면 포메이션 템플릿의 기본 등번호를 사용한다. */
  number?: number;
}

/**
 * 포메이션 템플릿의 좌표 슬롯에 실제 선수 명단을 채워 넣는다.
 * roster는 반드시 PITCH_TEMPLATES[formationId]와 같은 순서(GK -> DF -> MF -> FW)로 전달해야 한다.
 */
export function buildPlayers(
  formationId: FormationId,
  roster: RosterEntry[],
): PlayerPosition[] {
  const template = PITCH_TEMPLATES[formationId];
  if (roster.length !== template.length) {
    throw new Error(
      `roster length(${roster.length}) does not match "${formationId}" template length(${template.length})`,
    );
  }

  return template.map((slot, index) => ({
    playerId: roster[index].id,
    name: roster[index].name,
    number: roster[index].number ?? slot.number,
    positionLabel: slot.positionLabel,
    inPossession: slot.inPossession,
    outOfPossession: slot.outOfPossession,
  }));
}
