import { PITCH_TEMPLATES, type PositionTemplate } from "@/data/pitchTemplates";
import { splitNameLines } from "@/lib/playerLabel";
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

export type SlotRole =
  | "gk"
  | "cb"
  | "wideDefender"
  | "pivot"
  | "wideAttacker"
  | "striker"
  | "other";

/**
 * 포지션 라벨이 아니라 템플릿 좌표의 기하학적 특징만으로 슬롯의 역할을 분류한다.
 * 포메이션마다 같은 라벨(RCM 등)이라도 실제 역할이 다르고(예: 4-4-2의 와이드 RCM vs 중앙 RCM),
 * 좌표 기반 분류를 쓰면 포메이션에 상관없이 일관되게 적용할 수 있다.
 * - wideDefender: 비소유 시 낮은 위치(y<40)이고 터치라인 쪽으로 크게 벌어진(diff>=18) 슬롯 — 풀백/윙백
 * - wideAttacker: 소유 시 전진해 있고(y>=60) 중앙을 벗어난(diff>=10) 슬롯 — 윙어/와이드 미드필더/인사이드 포워드
 * - pivot: 중앙에 가깝고 소유 시 y가 28~50 사이 — 단일/더블 피봇
 * - striker: 중앙(diff<10)에서 소유 시 y>=84인 최전방 슬롯
 * - cb: 중앙에 가깝고 소유 시 y<28 — 센터백
 *
 * 최전방 판정에 폭 조건이 붙는 이유: 높이만 보면 4-3-3의 윙어(y=88)까지 스트라이커가 되어
 * falseNine이 3명 모두를 밀고 wingerTuck은 받을 슬롯이 없어진다. 최전방 스트라이커는 어느
 * 포메이션에서도 중앙에서 8칸 안쪽이라, 10칸으로 윙어와 갈라진다.
 *
 * 두 와이드 역할이 폭 기준을 따로 쓰는 이유: 하나로 합치면 백3 포메이션이 무너진다.
 * 3-4-2-1/3-5-2의 좌우 센터백은 중앙에서 15~16칸이라 풀백 기준(18)을 조금만 낮춰도 풀백으로
 * 잘못 분류되고, 반대로 3-4-2-1의 인사이드 포워드는 15칸뿐이라 18 기준에서는 wideAttacker가
 * 되지 못해 wingerTuck이 조용히 무음 처리된다. 전진 여부(y>=60)를 먼저 보면 두 무리가 애초에
 * 섞이지 않으므로, 각자에게 맞는 폭 기준을 쓸 수 있다.
 */
export function classifySlot(slot: PositionTemplate): SlotRole {
  if (slot.positionLabel === "GK") return "gk";

  const xDiff = Math.abs(slot.inPossession.x - 50);

  if (slot.inPossession.y >= 84 && xDiff < 10) return "striker";
  if (slot.outOfPossession.y < 40 && xDiff >= 18) return "wideDefender";
  if (slot.inPossession.y >= 60 && xDiff >= 10) return "wideAttacker";

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

  if (role === "wideDefender") {
    // 좌우 역할이 다른 팀(한쪽은 백3에 합류, 반대쪽은 높이 전진)을 표현하려면 side별 값이 필요하다.
    // 어느 쪽 풀백인지는 템플릿 좌표의 x로 판별한다(x >= 50이 오른쪽).
    const sideInvert = coord.x >= 50 ? style.fullbackInvertRight : style.fullbackInvertLeft;
    const invert = (sideInvert ?? style.fullbackInvert ?? 0) * roleGain;
    if (invert) {
      x = 50 + (x - 50) * (1 - invert * 0.35);
      y = y - invert * 10;
    }
  } else if (role === "wideAttacker") {
    // 풀백과 같은 이유로 윙어도 좌우가 갈린다. 한쪽은 터치라인에 붙어 1대1을 걸고 반대쪽은
    // 안으로 좁혀 슈팅을 노리는 팀이 있어, side별 값이 있으면 그쪽을 먼저 쓴다.
    const sideTuck = coord.x >= 50 ? style.wingerTuckRight : style.wingerTuckLeft;
    const tuck = (sideTuck ?? style.wingerTuck ?? 0) * roleGain;
    if (tuck) {
      x = 50 + (x - 50) * (1 - tuck * 0.35);
    }
  } else if (role === "pivot" && style.anchorDrop) {
    const drop = style.anchorDrop * roleGain;
    y = y - drop * 14;
    x = 50 + (x - 50) * (1 + drop * 0.15);
  } else if (role === "striker" && style.falseNine && phase === "in") {
    // 폴스나인은 공을 가졌을 때 중원으로 내려와 수적 우위를 만드는 움직임이지, 수비할 때의 자리가
    // 아니다. 비소유 시 최전방은 압박의 첫 줄이라 10번 뒤로 물러나면 오히려 틀린 그림이 된다.
    // 템플릿이 이미 비소유 시 스트라이커를 y 92 -> 55로 내려주므로 따로 더할 것도 없다.
    const drop = style.falseNine;
    // 내려오는 방향(양수)은 여유가 넉넉하지만, 타겟맨(음수)이 전진할 공간은 템플릿 최전방이
    // 이미 y 88~95라 몇 칸뿐이다. 고정 배수로 밀면 골라인 밖에서 잘려 값이 달라도 결과가 같아지므로,
    // 전진은 남은 공간에 비례해 밀어 어떤 값에서도 포화되지 않게 한다.
    y = drop >= 0 ? y - drop * 20 : y + -drop * (97 - y) * 0.8;
  }

  return { x: clamp(x, 3, 97), y: clamp(y, 3, 97) };
}

/**
 * PitchBoard의 SVG viewBox는 가로 100 / 세로 150이므로(PitchBoard.tsx의 VIEW_WIDTH/VIEW_HEIGHT),
 * 데이터 좌표계(0~100)의 y 1칸은 화면에서 x 1칸보다 1.5배 길게 그려진다. 토큰 간 거리를 화면에
 * 보이는 그대로 계산하려면 y에 이 배율을 곱해서 비교해야 한다.
 */
const VIEW_Y_SCALE = 1.5;
/** 토큰 원(반지름 4.2) + 이름 한 줄 + 포지션 라벨이 차지하는 기본 세로 공간을 덮는 최소 간격. */
const BASE_TOKEN_DISTANCE = 11;
/**
 * 이름표가 길수록(특히 "선수A / 선수B" 로테이션 표기) 좌우로 넓게 퍼져 옆 토큰과 겹치기 쉽다.
 * 이름 문자 수에 비례해 최소 간격에 여유를 더하되, 지나치게 벌어지지 않도록 상한을 둔다.
 */
function estimateLabelPadding(name: string): number {
  const longestLine = Math.max(...splitNameLines(name).map((line) => line.length));
  return clamp((longestLine - 4) * 1.1, 0, 10);
}

/**
 * 전술 스타일 보정을 거친 좌표들이 서로 너무 가까워져 화면에서 토큰이 겹치는 것을 막는다.
 * 겹치는 쌍을 반복적으로 서로 밀어내는 단순한 완화(relaxation) 방식으로, 이미 충분히 떨어진
 * 좌표는 건드리지 않고 최소 간격보다 가까운 경우에만 밀어낸다. 최소 간격은 두 토큰의 이름
 * 길이에 따라 달라진다(estimateLabelPadding).
 */
function resolveOverlaps(
  coords: PitchCoordinate[],
  names: string[],
  roles: SlotRole[],
): PitchCoordinate[] {
  const points = coords.map((c) => ({ x: c.x, y: c.y * VIEW_Y_SCALE }));
  const paddings = names.map(estimateLabelPadding);
  // 골키퍼는 골문에 묶여 있다. 좌우로 벗어나면 곧바로 어색하므로 x는 완전히 고정하고, 상대 토큰이
  // 가로 몫을 대신 받는다. 세로는 조금만 움직이게 둔다. 완전히 묶으면 중앙 센터백이 겹침을 혼자
  // 받아 좌우 센터백보다 앞으로 튀어나가 백3 스태거가 뒤집히고, 반대로 그냥 풀면 낮은 블록을
  // 쓰는 팀에서 골라인까지 밀려 두 국면이 같은 자리에 서 버린다.
  const GK_Y_GIVE = 0.75;
  const isGk = roles.map((role) => role === "gk");
  const clampPoint = (p: { x: number; y: number }) => {
    p.x = clamp(p.x, 3, 97);
    p.y = clamp(p.y, 3 * VIEW_Y_SCALE, 97 * VIEW_Y_SCALE);
  };
  points.forEach(clampPoint);

  for (let iteration = 0; iteration < 24; iteration += 1) {
    let movedAny = false;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const minDistance = BASE_TOKEN_DISTANCE + paddings[i] + paddings[j];
        const dx = points[j].x - points[i].x;
        const dy = points[j].y - points[i].y;
        const distance = Math.hypot(dx, dy);

        if (distance >= minDistance) continue;
        movedAny = true;

        const push = (minDistance - distance) / 2;
        const [ux, uy] = distance > 0.001 ? [dx / distance, dy / distance] : [1, 0];
        // 한쪽이 덜 움직이는 만큼 반대쪽이 더 받아, 두 토큰 사이 간격은 그대로 확보한다.
        const share = (self: boolean, other: boolean, give: number) =>
          (self ? give : 1) + (other ? 1 - give : 0);
        const xI = share(isGk[i], isGk[j], 0);
        const xJ = share(isGk[j], isGk[i], 0);
        const yI = share(isGk[i], isGk[j], GK_Y_GIVE);
        const yJ = share(isGk[j], isGk[i], GK_Y_GIVE);
        points[i].x -= ux * push * xI;
        points[j].x += ux * push * xJ;
        points[i].y -= uy * push * yI;
        points[j].y += uy * push * yJ;
        // 매 밀어내기 직후 경계로 다시 눌러, 한쪽이 경계에 막힌 만큼 반대쪽이 더 밀리도록 한다.
        clampPoint(points[i]);
        clampPoint(points[j]);
      }
    }
    if (!movedAny) break;
  }

  return points.map((p) => ({
    x: clamp(p.x, 3, 97),
    y: clamp(p.y / VIEW_Y_SCALE, 3, 97),
  }));
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

  const roles = template.map(classifySlot);
  const names = roster.map((entry) => entry.name);
  const inPossessionCoords = resolveOverlaps(
    template.map((slot, index) => applyTacticalStyle(slot.inPossession, style, roles[index], "in")),
    names,
    roles,
  );
  const outOfPossessionCoords = resolveOverlaps(
    template.map((slot, index) => applyTacticalStyle(slot.outOfPossession, style, roles[index], "out")),
    names,
    roles,
  );

  return template.map((slot, index) => ({
    playerId: roster[index].id,
    name: roster[index].name,
    number: roster[index].number ?? slot.number,
    positionLabel: slot.positionLabel,
    inPossession: inPossessionCoords[index],
    outOfPossession: outOfPossessionCoords[index],
  }));
}
