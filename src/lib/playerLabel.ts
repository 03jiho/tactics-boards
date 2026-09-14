/**
 * "선수A / 선수B" 형태의 로테이션 경쟁 표기를 표시용으로 최대 2줄로 나눈다.
 * 한 줄로 이어 쓰면 매우 길어져 옆 토큰과 겹치기 쉬우므로, "/" 기준으로 줄바꿈한다.
 * PlayerToken(렌더링)과 players.ts(토큰 간 최소 간격 계산)가 동일한 줄바꿈 기준을 공유해야
 * 겹침 방지 계산이 실제 렌더링과 어긋나지 않는다.
 */
export function splitNameLines(name: string): string[] {
  if (!name.includes(" / ")) return [name];
  const [first, ...rest] = name.split(" / ");
  return [first, `/ ${rest.join(" / ")}`];
}
