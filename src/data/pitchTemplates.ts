import type { FormationId, PitchCoordinate, PositionLabel } from "@/types/football";

/**
 * 포메이션별 기본 좌표 템플릿.
 * 좌표계: x 0(왼쪽 터치라인)~100(오른쪽 터치라인), y 0(자기 골라인)~100(상대 골라인).
 * 공격 방향은 y가 증가하는 방향(위쪽)이다.
 */
export interface PositionTemplate {
  number: number;
  positionLabel: PositionLabel;
  inPossession: PitchCoordinate;
  outOfPossession: PitchCoordinate;
}

export const PITCH_TEMPLATES: Record<FormationId, PositionTemplate[]> = {
  "4-3-3": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 2, positionLabel: "RB", inPossession: { x: 76, y: 58 }, outOfPossession: { x: 78, y: 30 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 62, y: 20 }, outOfPossession: { x: 60, y: 18 } },
    { number: 5, positionLabel: "LCB", inPossession: { x: 38, y: 20 }, outOfPossession: { x: 40, y: 18 } },
    { number: 3, positionLabel: "LB", inPossession: { x: 24, y: 58 }, outOfPossession: { x: 22, y: 30 } },
    { number: 6, positionLabel: "DM", inPossession: { x: 50, y: 40 }, outOfPossession: { x: 50, y: 36 } },
    { number: 8, positionLabel: "RCM", inPossession: { x: 66, y: 55 }, outOfPossession: { x: 64, y: 44 } },
    { number: 10, positionLabel: "LCM", inPossession: { x: 34, y: 55 }, outOfPossession: { x: 36, y: 44 } },
    { number: 7, positionLabel: "RW", inPossession: { x: 85, y: 88 }, outOfPossession: { x: 80, y: 62 } },
    { number: 11, positionLabel: "LW", inPossession: { x: 15, y: 88 }, outOfPossession: { x: 20, y: 62 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 50, y: 95 }, outOfPossession: { x: 50, y: 58 } },
  ],
  "4-2-3-1": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 2, positionLabel: "RB", inPossession: { x: 75, y: 55 }, outOfPossession: { x: 76, y: 28 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 62, y: 20 }, outOfPossession: { x: 60, y: 18 } },
    { number: 5, positionLabel: "LCB", inPossession: { x: 38, y: 20 }, outOfPossession: { x: 40, y: 18 } },
    { number: 3, positionLabel: "LB", inPossession: { x: 25, y: 55 }, outOfPossession: { x: 24, y: 28 } },
    { number: 6, positionLabel: "RCM", inPossession: { x: 60, y: 38 }, outOfPossession: { x: 58, y: 34 } },
    { number: 8, positionLabel: "LCM", inPossession: { x: 40, y: 38 }, outOfPossession: { x: 42, y: 34 } },
    { number: 7, positionLabel: "RAM", inPossession: { x: 78, y: 72 }, outOfPossession: { x: 74, y: 50 } },
    { number: 10, positionLabel: "CAM", inPossession: { x: 50, y: 75 }, outOfPossession: { x: 50, y: 52 } },
    { number: 11, positionLabel: "LAM", inPossession: { x: 22, y: 72 }, outOfPossession: { x: 26, y: 50 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 50, y: 92 }, outOfPossession: { x: 50, y: 55 } },
  ],
  "3-4-2-1": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 66, y: 18 }, outOfPossession: { x: 64, y: 16 } },
    { number: 5, positionLabel: "CB", inPossession: { x: 50, y: 15 }, outOfPossession: { x: 50, y: 14 } },
    { number: 3, positionLabel: "LCB", inPossession: { x: 34, y: 18 }, outOfPossession: { x: 36, y: 16 } },
    { number: 2, positionLabel: "RWB", inPossession: { x: 85, y: 60 }, outOfPossession: { x: 82, y: 34 } },
    { number: 6, positionLabel: "RCM", inPossession: { x: 62, y: 42 }, outOfPossession: { x: 58, y: 36 } },
    { number: 8, positionLabel: "LCM", inPossession: { x: 38, y: 42 }, outOfPossession: { x: 42, y: 36 } },
    { number: 7, positionLabel: "LWB", inPossession: { x: 15, y: 60 }, outOfPossession: { x: 18, y: 34 } },
    { number: 10, positionLabel: "RAM", inPossession: { x: 65, y: 78 }, outOfPossession: { x: 60, y: 55 } },
    { number: 11, positionLabel: "LAM", inPossession: { x: 35, y: 78 }, outOfPossession: { x: 40, y: 55 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 50, y: 92 }, outOfPossession: { x: 50, y: 58 } },
  ],
  "4-4-2": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 2, positionLabel: "RB", inPossession: { x: 78, y: 52 }, outOfPossession: { x: 80, y: 28 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 62, y: 20 }, outOfPossession: { x: 60, y: 18 } },
    { number: 5, positionLabel: "LCB", inPossession: { x: 38, y: 20 }, outOfPossession: { x: 40, y: 18 } },
    { number: 3, positionLabel: "LB", inPossession: { x: 22, y: 52 }, outOfPossession: { x: 20, y: 28 } },
    { number: 7, positionLabel: "RCM", inPossession: { x: 82, y: 62 }, outOfPossession: { x: 80, y: 42 } },
    { number: 8, positionLabel: "RCM", inPossession: { x: 60, y: 50 }, outOfPossession: { x: 58, y: 40 } },
    { number: 6, positionLabel: "LCM", inPossession: { x: 40, y: 50 }, outOfPossession: { x: 42, y: 40 } },
    { number: 11, positionLabel: "LCM", inPossession: { x: 18, y: 62 }, outOfPossession: { x: 20, y: 42 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 58, y: 88 }, outOfPossession: { x: 56, y: 55 } },
    { number: 10, positionLabel: "ST", inPossession: { x: 42, y: 88 }, outOfPossession: { x: 44, y: 55 } },
  ],
  "3-5-2": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 65, y: 18 }, outOfPossession: { x: 63, y: 16 } },
    { number: 5, positionLabel: "CB", inPossession: { x: 50, y: 15 }, outOfPossession: { x: 50, y: 14 } },
    { number: 3, positionLabel: "LCB", inPossession: { x: 35, y: 18 }, outOfPossession: { x: 37, y: 16 } },
    { number: 2, positionLabel: "RWB", inPossession: { x: 88, y: 58 }, outOfPossession: { x: 84, y: 32 } },
    { number: 8, positionLabel: "RCM", inPossession: { x: 62, y: 45 }, outOfPossession: { x: 58, y: 38 } },
    { number: 6, positionLabel: "CM", inPossession: { x: 50, y: 42 }, outOfPossession: { x: 50, y: 36 } },
    { number: 10, positionLabel: "LCM", inPossession: { x: 38, y: 45 }, outOfPossession: { x: 42, y: 38 } },
    { number: 7, positionLabel: "LWB", inPossession: { x: 12, y: 58 }, outOfPossession: { x: 16, y: 32 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 58, y: 90 }, outOfPossession: { x: 56, y: 58 } },
    { number: 11, positionLabel: "ST", inPossession: { x: 42, y: 90 }, outOfPossession: { x: 44, y: 58 } },
  ],
  "5-3-2": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 65, y: 18 }, outOfPossession: { x: 63, y: 16 } },
    { number: 5, positionLabel: "CB", inPossession: { x: 50, y: 14 }, outOfPossession: { x: 50, y: 13 } },
    { number: 3, positionLabel: "LCB", inPossession: { x: 35, y: 18 }, outOfPossession: { x: 37, y: 16 } },
    { number: 2, positionLabel: "RWB", inPossession: { x: 80, y: 50 }, outOfPossession: { x: 78, y: 28 } },
    { number: 8, positionLabel: "RCM", inPossession: { x: 60, y: 42 }, outOfPossession: { x: 58, y: 36 } },
    { number: 6, positionLabel: "CM", inPossession: { x: 50, y: 38 }, outOfPossession: { x: 50, y: 34 } },
    { number: 10, positionLabel: "LCM", inPossession: { x: 40, y: 42 }, outOfPossession: { x: 42, y: 36 } },
    { number: 7, positionLabel: "LWB", inPossession: { x: 20, y: 50 }, outOfPossession: { x: 22, y: 28 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 58, y: 85 }, outOfPossession: { x: 56, y: 55 } },
    { number: 11, positionLabel: "ST", inPossession: { x: 42, y: 85 }, outOfPossession: { x: 44, y: 55 } },
  ],
  "4-3-1-2": [
    { number: 1, positionLabel: "GK", inPossession: { x: 50, y: 6 }, outOfPossession: { x: 50, y: 10 } },
    { number: 2, positionLabel: "RB", inPossession: { x: 70, y: 50 }, outOfPossession: { x: 72, y: 26 } },
    { number: 4, positionLabel: "RCB", inPossession: { x: 62, y: 18 }, outOfPossession: { x: 60, y: 16 } },
    { number: 5, positionLabel: "LCB", inPossession: { x: 38, y: 18 }, outOfPossession: { x: 40, y: 16 } },
    { number: 3, positionLabel: "LB", inPossession: { x: 30, y: 50 }, outOfPossession: { x: 28, y: 26 } },
    { number: 6, positionLabel: "DM", inPossession: { x: 50, y: 36 }, outOfPossession: { x: 50, y: 32 } },
    { number: 8, positionLabel: "RCM", inPossession: { x: 64, y: 48 }, outOfPossession: { x: 60, y: 40 } },
    { number: 10, positionLabel: "LCM", inPossession: { x: 36, y: 48 }, outOfPossession: { x: 40, y: 40 } },
    { number: 7, positionLabel: "CAM", inPossession: { x: 50, y: 68 }, outOfPossession: { x: 50, y: 48 } },
    { number: 9, positionLabel: "ST", inPossession: { x: 58, y: 90 }, outOfPossession: { x: 56, y: 58 } },
    { number: 11, positionLabel: "ST", inPossession: { x: 42, y: 90 }, outOfPossession: { x: 44, y: 58 } },
  ],
};
