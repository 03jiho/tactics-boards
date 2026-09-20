import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getFormationById } from "@/data/formations";
import { getTeamById, TEAMS } from "@/data/teams";
import { TeamHeader } from "@/components/team-detail/TeamHeader";
import { TacticsSection } from "@/components/team-detail/TacticsSection";
import { KeyPlayersSection } from "@/components/team-detail/KeyPlayersSection";
import { TacticalHighlightsSection } from "@/components/team-detail/TacticalHighlightsSection";
import { PitchPanel } from "@/components/pitch/PitchPanel";

export function generateStaticParams() {
  return TEAMS.map((team) => ({ teamId: team.id }));
}

interface TeamDetailPageProps {
  params: Promise<{ teamId: string }>;
}

export async function generateMetadata(
  { params }: TeamDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { teamId } = await params;
  const team = getTeamById(teamId);

  if (!team) return {};

  const title = `${team.name} 전술 분석 | Tactics Board`;
  const description = `${team.league} · 감독 ${team.manager} · 주 포메이션 ${team.primaryFormationId}. ${team.shortSummary}`;
  // openGraph/twitter는 부모 값을 병합하지 않고 통째로 대체하므로, 공용 썸네일과
  // summary_large_image 카드 설정을 부모에서 직접 가져와 다시 지정한다.
  const parentMetadata = await parent;
  const images = parentMetadata.openGraph?.images ?? [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/teams/${team.id}`,
      siteName: "Tactics Board",
      locale: "ko_KR",
      type: "article",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId } = await params;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const formation = getFormationById(team.primaryFormationId);
  if (!formation) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <TeamHeader team={team} formation={formation} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-8">
          <TacticsSection tactical={team.tactical} />
          <KeyPlayersSection keyPlayers={team.tactical.keyPlayers} accentColor={team.accentColor} />
          <TacticalHighlightsSection
            highlights={team.tactical.tacticalHighlights}
            reportSummary={team.tactical.reportSummary}
          />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <PitchPanel players={team.players} accentColor={team.accentColor} />
        </div>
      </div>
    </div>
  );
}
