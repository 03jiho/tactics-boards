/**
 * 도메인 타입 정의
 * Formation -> Team -> TacticalDetail -> PitchCoordinate 순으로 구성된다.
 */

export type FormationId =
  | "4-3-3"
  | "4-2-3-1"
  | "3-4-2-1"
  | "4-4-2"
  | "3-5-2"
  | "5-3-2"
  | "4-3-1-2";

export type FormationCategory = "back-4" | "back-3";

export interface Formation {
  id: FormationId;
  /** 화면에 노출되는 이름, 예: "4-2-3-1" */
  name: string;
  /** 짧은 별칭, 예: "더블 피봇형" */
  nickname: string;
  category: FormationCategory;
  /** 포메이션 개요 설명 */
  description: string;
}

/** 핏치 위 상대 좌표계. x: 0(왼쪽 터치라인)~100(오른쪽 터치라인), y: 0(자기 골라인)~100(상대 골라인) */
export interface PitchCoordinate {
  x: number;
  y: number;
}

export type PositionLabel =
  | "GK"
  | "RB"
  | "LB"
  | "RCB"
  | "LCB"
  | "CB"
  | "RWB"
  | "LWB"
  | "DM"
  | "RCM"
  | "LCM"
  | "CM"
  | "RAM"
  | "LAM"
  | "CAM"
  | "RW"
  | "LW"
  | "RF"
  | "LF"
  | "ST";

/**
 * 같은 포메이션이라도 팀마다 다른 전술 색깔(라인 높이, 폭)을 반영하기 위한 좌표 보정값.
 * 포메이션 템플릿 좌표에 곱/합 형태로 적용된다. 값의 범위는 -1~1이 기준이다.
 */
export interface TacticalStyle {
  /** 수비 라인 높이. 1에 가까울수록 매우 높은 라인, -1에 가까울수록 매우 낮은 라인(로우블록). */
  lineHeight: number;
  /** 진영 폭. 1에 가까울수록 좌우로 넓게 벌리고, -1에 가까울수록 좁고 압축적인 대형. */
  width: number;
  /**
   * 측면 공격 자원(윙어/와이드 미드필더)의 인버트 정도. 1에 가까울수록 안쪽으로 좁혀 들어가는
   * 인버티드 윙어, -1에 가까울수록 터치라인에 붙어 폭을 유지하는 전통적 윙어. 기본값 0.
   */
  wingerTuck?: number;
  /**
   * 풀백/윙백의 빌드업 움직임. 1에 가까울수록 안쪽으로 좁혀 들어가 유사 센터백/더블 피봇을
   * 형성하는 인버티드 풀백, -1에 가까울수록 터치라인 높이 전진하는 오버래핑 풀백. 기본값 0.
   * 양쪽 풀백에 함께 적용되므로, 좌우 역할이 다른 팀은 아래 두 값으로 한쪽씩 덮어쓴다.
   */
  fullbackInvert?: number;
  /** 왼쪽 풀백만 따로 지정한다. 생략하면 fullbackInvert를 쓴다. */
  fullbackInvertLeft?: number;
  /** 오른쪽 풀백만 따로 지정한다. 생략하면 fullbackInvert를 쓴다. */
  fullbackInvertRight?: number;
  /**
   * 중원 피봇이 백라인 사이/옆으로 내려가 빌드업을 지원하는 정도. 1에 가까울수록 깊게 내려가
   * 임시 백3/백4를 형성하고, -1에 가까울수록 내려가지 않고 높은 위치를 유지한다. 기본값 0.
   */
  anchorDrop?: number;
  /**
   * 최전방 공격수가 처지는 정도(폴스나인). 1에 가까울수록 중원까지 깊게 내려와 연계하고,
   * -1에 가까울수록 최전방에 고정된 표적형(타겟맨) 스트라이커. 기본값 0.
   */
  falseNine?: number;
}

export interface PlayerPosition {
  playerId: string;
  name: string;
  number: number;
  positionLabel: PositionLabel;
  /** 공 소유 시(빌드업/공격) 좌표 */
  inPossession: PitchCoordinate;
  /** 공 미소유 시(수비 대형) 좌표 */
  outOfPossession: PitchCoordinate;
}

export interface KeyPlayer {
  playerId: string;
  name: string;
  /** 등번호가 확인되지 않은 경우 생략할 수 있다. */
  number?: number;
  /** 전술적 역할, 예: "하프스페이스 침투형 8번" */
  role: string;
  description: string;
}

export interface PossessionTactic {
  summary: string;
  /** 빌드업 대형/방식 설명 */
  buildUpDescription: string;
  keyPoints: string[];
}

export interface NonPossessionTactic {
  summary: string;
  /** 수비 대형 설명 */
  defensiveShapeDescription: string;
  /** 압박 방식 설명 */
  pressingDescription: string;
  keyPoints: string[];
}

export interface TacticalDetail {
  inPossession: PossessionTactic;
  outOfPossession: NonPossessionTactic;
  keyPlayers: KeyPlayer[];
  /** 관전 포인트 */
  tacticalHighlights: string[];
  reportSummary: string;
}

export interface Team {
  id: string;
  name: string;
  league: string;
  country: string;
  manager: string;
  primaryFormationId: FormationId;
  /** 팀 배지 대체용 컬러(엠블럼 이미지가 없을 때 이니셜 배지를 그릴 때 사용) */
  accentColor: string;
  /** 구단 엠블럼 이미지 경로(public/ 기준). 없으면 이니셜 배지로 대체된다. */
  crestUrl?: string;
  /** 이 클럽 소속 한국 선수 이름(있는 경우). 홈 화면의 한국 선수 소속 클럽 필터에 사용된다. */
  koreanPlayer?: string;
  /** 같은 포메이션을 쓰는 다른 팀과 포메이션 보드를 시각적으로 구분하기 위한 전술 스타일 보정값. */
  tacticalStyle: TacticalStyle;
  shortSummary: string;
  tactical: TacticalDetail;
  players: PlayerPosition[];
}

export type PossessionPhase = "in-possession" | "out-of-possession";

export type TeamSortKey = "name" | "league" | "manager";
