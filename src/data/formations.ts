import type { Formation } from "@/types/football";

export const FORMATIONS: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    nickname: "포지셔널 플레이형",
    category: "back-4",
    description:
      "센터백 앞 단일 수비형 미드필더와 좌우 8번이 삼각형을 이루고, 윙어가 터치라인을 넓게 벌려주는 균형형 포메이션. 점유율 기반 빌드업에 강하다.",
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    nickname: "더블 피봇형",
    category: "back-4",
    description:
      "두 명의 수비형 미드필더가 안정적으로 후방을 지키고, 그 앞의 3인 공격형 미드필더 라인이 창의성을 담당하는 구조. 수비 안정성과 공격 전개의 균형이 좋다.",
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    nickname: "윙백 크리스마스 트리형",
    category: "back-3",
    description:
      "3백 뒤에서 안정성을 확보하고 좌우 윙백이 폭을 담당하며, 스트라이커 뒤 두 명의 섀도우 스트라이커가 하프스페이스를 침투하는 구조.",
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    nickname: "플랫 포백형",
    category: "back-4",
    description:
      "두 줄의 4명이 간격을 유지하며 블록을 형성하고, 두 명의 최전방 공격수가 함께 움직이는 전통적 구조. 압박 방향이 단순하고 명확하다.",
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    nickname: "스리백 윙백형",
    category: "back-3",
    description:
      "중원 숫자 우위를 확보하는 3백 기반 포메이션으로, 좌우 윙백이 공수 양면에서 터치라인을 오르내리며 두 명의 스트라이커를 지원한다.",
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    nickname: "실리적 백5형",
    category: "back-3",
    description:
      "3-5-2와 골격은 비슷하지만 윙백이 공격 시에도 상대적으로 낮은 위치를 유지하는, 수비 우선의 보수적인 백5 포메이션. 직선적인 롱볼 전개와 잘 어울린다.",
  },
  {
    id: "4-3-1-2",
    name: "4-3-1-2",
    nickname: "다이아몬드형",
    category: "back-4",
    description:
      "측면 미드필더 없이 중앙에 마름모(다이아몬드) 형태로 미드필더 4명을 배치하고 두 명의 스트라이커를 세우는 좁고 압축적인 구조. 측면 폭은 풀백이 전담한다.",
  },
];

export function getFormationById(id: string) {
  return FORMATIONS.find((formation) => formation.id === id);
}
