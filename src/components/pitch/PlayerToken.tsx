interface PlayerTokenProps {
  x: number;
  y: number;
  number: number;
  name: string;
  positionLabel: string;
  accentColor: string;
}

/**
 * 핏치 위에 놓이는 바둑알 형태의 선수 토큰.
 * cx/cy는 이미 뷰박스 좌표로 변환된 값을 그대로 받는다.
 */
export function PlayerToken({
  x,
  y,
  number,
  name,
  positionLabel,
  accentColor,
}: PlayerTokenProps) {
  return (
    <g
      className="transition-transform duration-700 ease-out"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <circle
        r={4.2}
        fill={accentColor}
        stroke="white"
        strokeWidth={0.5}
        className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={3.6}
        fontWeight={700}
        fill="white"
      >
        {number}
      </text>
      <text
        y={7.4}
        textAnchor="middle"
        fontSize={2.6}
        fontWeight={700}
        fill="white"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={0.5}
        paintOrder="stroke"
      >
        {name}
      </text>
      <text
        y={10.4}
        textAnchor="middle"
        fontSize={2.1}
        fill="white"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={0.4}
        paintOrder="stroke"
        className="hidden sm:inline"
      >
        {positionLabel}
      </text>
    </g>
  );
}
