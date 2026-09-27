import type { FormationId, PitchCoordinate } from "@/types/football";

/**
 * 공 소유 시 팀이 실제로 만드는 대형.
 *
 * 스타일 파라미터(fullbackInvert 등)는 기본 템플릿을 조금 밀고 당기는 용도라, 풀백이 센터백
 * 옆까지 38칸을 내려가는 것 같은 구조 변화는 표현하지 못한다. 그래서 대형이 아예 바뀌는 팀은
 * 소유 시 좌표를 직접 적는다.
 *
 * 키는 "기본 포메이션:소유 시 대형"이고, 배열은 그 기본 포메이션 템플릿의 슬롯 순서를 그대로
 * 따른다(PITCH_TEMPLATES와 같은 순서). 같은 조합을 쓰는 팀은 이 좌표를 공유한다.
 */
export type PossessionShapeId = "3-2-4-1";

export function possessionShapeKey(base: FormationId, shape: PossessionShapeId): string {
  return `${base}:${shape}`;
}

export const POSSESSION_SHAPES: Record<string, PitchCoordinate[]> = {
  // 4-3-3 -> 3-2-4-1
  // 왼쪽 풀백이 센터백 옆으로 내려와 백3을 만들고, 오른쪽 풀백은 반대로 전방 4인 줄에 합류한다.
  // 수비형 미드필더와 오른쪽 8번이 그 앞에 더블 피봇으로 서고, 왼쪽 8번이 하프스페이스로 전진한다.
  "4-3-3:3-2-4-1": [
    { x: 50, y: 8 }, // GK
    { x: 66, y: 70 }, // RB  -> 전방 4인의 오른쪽 하프스페이스
    { x: 66, y: 25 }, // RCB -> 백3 오른쪽
    { x: 50, y: 21 }, // LCB -> 백3 중앙
    { x: 34, y: 25 }, // LB  -> 백3 왼쪽(인버트)
    { x: 60, y: 40 }, // DM  -> 더블 피봇
    { x: 40, y: 40 }, // RCM -> 더블 피봇
    { x: 34, y: 70 }, // LCM -> 전방 4인의 왼쪽 하프스페이스
    { x: 88, y: 80 }, // RW
    { x: 12, y: 80 }, // LW
    { x: 50, y: 92 }, // ST
  ],
};
