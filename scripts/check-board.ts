/**
 * 포메이션 보드 데이터의 불변식 검사. `npm run check`로 실행한다.
 *
 * 1) 어떤 팀·국면에서도 선수 토큰이 서로 겹치지 않는다.
 * 2) fullbackInvertLeft/Right를 쓰는 팀은 두 풀백이 실제로 다른 폭으로 배치된다.
 */
import assert from "node:assert/strict";
import { PITCH_TEMPLATES } from "../src/data/pitchTemplates";
import { TEAMS } from "../src/data/teams";
import { splitNameLines } from "../src/lib/playerLabel";

/** PitchBoard의 viewBox가 100x150이라, y 1칸은 화면에서 x 1칸의 1.5배로 보인다. */
const VIEW_Y_SCALE = 1.5;
const BASE_TOKEN_DISTANCE = 11;

function labelPadding(name: string): number {
  const longest = Math.max(...splitNameLines(name).map((line) => line.length));
  return Math.min(10, Math.max(0, (longest - 4) * 1.1));
}

let pairs = 0;
const overlaps: string[] = [];

for (const team of TEAMS) {
  assert.equal(
    team.players.length,
    PITCH_TEMPLATES[team.primaryFormationId].length,
    `${team.id}: 명단 인원이 포메이션 템플릿과 다르다`,
  );

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

// 좌우를 분리한 팀은 두 풀백이 같은 폭으로 좁혀지면 안 된다.
const split = TEAMS.filter(
  (team) =>
    team.tacticalStyle.fullbackInvertLeft !== undefined ||
    team.tacticalStyle.fullbackInvertRight !== undefined,
);

for (const team of split) {
  const template = PITCH_TEMPLATES[team.primaryFormationId];
  const fullbacks = team.players.filter((_, index) => {
    const slot = template[index];
    return Math.abs(slot.inPossession.x - 50) >= 18 && slot.outOfPossession.y < 40;
  });
  assert.equal(fullbacks.length, 2, `${team.id}: 좌우 풀백 슬롯을 2개 찾지 못했다`);

  const [left, right] = fullbacks.map((p) => Math.abs(p.inPossession.x - 50).toFixed(2));
  assert.notEqual(
    left,
    right,
    `${team.id}: 좌우 값을 나눠 줬는데 두 풀백의 좁힘 폭이 같다`,
  );
}

console.log(`ok — ${TEAMS.length}팀 ${pairs}쌍 겹침 없음, 좌우 분리 ${split.length}팀 확인`);
