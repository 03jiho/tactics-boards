import { splitNameLines } from "@/lib/playerLabel";

interface PlayerTokenProps {
  x: number;
  y: number;
  number: number;
  name: string;
  positionLabel: string;
  accentColor: string;
}

const NAME_LINE_HEIGHT = 2.6;
const NAME_FIRST_LINE_Y = 7.4;

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
  const nameLines = splitNameLines(name);
  const positionLabelY = NAME_FIRST_LINE_Y + nameLines.length * NAME_LINE_HEIGHT;

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
      {nameLines.map((line, index) => (
        <text
          key={index}
          y={NAME_FIRST_LINE_Y + index * NAME_LINE_HEIGHT}
          textAnchor="middle"
          fontSize={2.6}
          fontWeight={700}
          fill="white"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={0.5}
          paintOrder="stroke"
        >
          {line}
        </text>
      ))}
      <text
        y={positionLabelY}
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
