/**
 * 포메이션 보드 데이터의 불변식 검사. `npm run check`로 실행한다.
 *
 * 1) 어떤 팀·국면에서도 선수 토큰이 서로 겹치지 않는다.
 * 2) fullbackInvertLeft/Right를 쓰는 팀은 두 풀백이 실제로 다른 폭으로 배치된다.
 * 3) 팀이 지정한 역할별 스타일 값은 그 포메이션에 해당 역할 슬롯이 있어야 한다.
 */
import assert from "node:assert/strict";
import { PITCH_TEMPLATES } from "../src/data/pitchTemplates";
import { TEAMS } from "../src/data/teams";
import { splitNameLines } from "../src/lib/playerLabel";
import { classifySlot, type SlotRole } from "../src/lib/players";
import type { TacticalStyle } from "../src/types/football";

/** PitchBoard의 viewBox가 100x150이라, y 1칸은 화면에서 x 1칸의 1.5배로 보인다. */
const VIEW_Y_SCALE = 1.5;
const BASE_TOKEN_DISTANCE = 11;

function labelPadding(name: string): number {
  const longest = Math.max(...splitNameLines(name).map((line) => line.length));
  return Math.min(10, Math.max(0, (longest - 4) * 1.1));
}

let pairs = 0;
const overlaps: string[] = [];

const duplicateNumbers: string[] = [];

for (const team of TEAMS) {
  assert.equal(
    team.players.length,
    PITCH_TEMPLATES[team.primaryFormationId].length,
    `${team.id}: 명단 인원이 포메이션 템플릿과 다르다`,
  );

  // 한 팀 안에서 등번호는 겹칠 수 없다. 조합 슬롯의 번호는 먼저 적힌 선수의 것이다.
  const owner = new Map<number, string>();
  for (const player of team.players) {
    const name = player.name.split(" / ")[0].trim();
    const already = owner.get(player.number);
    if (already) {
      duplicateNumbers.push(`${team.id}: ${player.number}번이 ${already}와 ${name}에게 중복 배정됐다`);
    } else {
      owner.set(player.number, name);
    }
  }

  for (const phase of ["inPossession", "outOfPossession"] as const) {
    for (let i = 0; i < team.players.length; i += 1) {
      for (let j = i + 1; j < team.players.length; j += 1) {
        const a = team.players[i];
        const b = team.players[j];
        const distance = Math.hypot(
          a[phase].x - b[phase].x,
          (a[phase].y - b[phase].y) * VIEW_Y_SCALE,
        );
        const minimum = BASE_TOKEN_DISTANCE + labelPadding(a.name) + labelPadding(b.name);
        pairs += 1;
        if (distance < minimum - 0.01) {
          overlaps.push(
            `${team.id} ${phase}: ${a.name} / ${b.name} (${distance.toFixed(2)} < ${minimum.toFixed(2)})`,
          );
        }
      }
    }
  }
}

assert.deepEqual(overlaps, [], `토큰이 겹치는 쌍이 있다:\n  ${overlaps.join("\n  ")}`);
assert.deepEqual(
  duplicateNumbers,
  [],
  `등번호가 중복된 팀이 있다:\n  ${duplicateNumbers.join("\n  ")}`,
);

// 좌우를 분리한 팀은 그 두 슬롯이 같은 폭으로 배치되면 안 된다. 나눠 줬는데 결과가 같다면
// 값이 상쇄됐거나 한쪽이 반영되지 않은 것이므로, 보드에서는 분리한 티가 나지 않는다.
const SPLIT_KEYS = [
  { left: "fullbackInvertLeft", right: "fullbackInvertRight", role: "wideDefender", label: "풀백" },
  { left: "wingerTuckLeft", right: "wingerTuckRight", role: "wideAttacker", label: "윙어" },
] as const;

const split = TEAMS.flatMap((team) =>
  SPLIT_KEYS.filter(
    (k) =>
      team.tacticalStyle[k.left] !== undefined || team.tacticalStyle[k.right] !== undefined,
  ).map((k) => ({ team, role: k.role as SlotRole, label: k.label })),
);

for (const { team, role, label } of split) {
  // 슬롯 판정은 players.ts와 같은 함수를 써야 한다. 같은 조건을 여기 베껴 두면
  // 분류 기준이 바뀔 때 이 검사만 조용히 옛 기준으로 남는다.
  const template = PITCH_TEMPLATES[team.primaryFormationId];
  const pair = team.players.filter((_, index) => classifySlot(template[index]) === role);
  assert.equal(pair.length, 2, `${team.id}: 좌우 ${label} 슬롯을 2개 찾지 못했다`);

  const [left, right] = pair.map((p) => Math.abs(p.inPossession.x - 50).toFixed(2));
  assert.notEqual(
    left,
    right,
    `${team.id}: 좌우 값을 나눠 줬는데 두 ${label}의 좁힘 폭이 같다`,
  );
}

/**
 * 역할별 스타일 값은 해당 역할로 분류되는 슬롯이 있을 때만 좌표에 반영된다. 슬롯이 없으면
 * 값을 적어도 아무 일도 일어나지 않는데, 보드만 봐서는 무음인지 알 수 없어 눈치채기 어렵다.
 * 3-4-2-1의 인사이드 포워드가 와이드 판정을 못 받아 wingerTuck이 죽어 있던 게 실제 사례다.
 */
const ROLE_FOR_STYLE_KEY: Partial<Record<keyof TacticalStyle, SlotRole>> = {
  wingerTuck: "wideAttacker",
  wingerTuckLeft: "wideAttacker",
  wingerTuckRight: "wideAttacker",
  fullbackInvert: "wideDefender",
  fullbackInvertLeft: "wideDefender",
  fullbackInvertRight: "wideDefender",
  anchorDrop: "pivot",
  falseNine: "striker",
};

const deadKeys: string[] = [];

for (const team of TEAMS) {
  const roles = new Set(PITCH_TEMPLATES[team.primaryFormationId].map(classifySlot));
  for (const [key, role] of Object.entries(ROLE_FOR_STYLE_KEY)) {
    if (team.tacticalStyle[key as keyof TacticalStyle] === undefined) continue;
    if (!roles.has(role)) {
      deadKeys.push(`${team.id}: ${key}를 지정했지만 ${team.primaryFormationId}에 ${role} 슬롯이 없다`);
    }
  }
}

assert.deepEqual(
  deadKeys,
  [],
  `좌표에 반영되지 않는 스타일 값이 있다:\n  ${deadKeys.join("\n  ")}`,
);

console.log(
  `ok — ${TEAMS.length}팀 ${pairs}쌍 겹침 없음, 좌우 분리 ${split.length}팀, 무음 스타일 값 없음`,
);
