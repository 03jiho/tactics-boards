import { Suspense } from "react";
import { HomeTeamExplorer } from "@/components/home/HomeTeamExplorer";
import { FORMATIONS } from "@/data/formations";
import { TEAMS } from "@/data/teams";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          포메이션으로 팀 탐색하기
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          포메이션을 선택하면 해당 전술을 주로 사용하는 팀과 감독을 확인할 수 있습니다.
        </p>
      </div>

      <Suspense fallback={null}>
        <HomeTeamExplorer teams={TEAMS} formations={FORMATIONS} />
      </Suspense>
    </div>
  );
}
