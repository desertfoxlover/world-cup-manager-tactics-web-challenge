import { useGameStore } from "../store/gameStore";

export function SelectPage() {
  const teams = useGameStore((s) => s.teams);
  const selectTeam = useGameStore((s) => s.selectTeam);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="select-page">
      <header className="page-header">
        <button type="button" className="btn ghost" onClick={() => setScreen("landing")}>
          ← 홈
        </button>
        <h1>대표팀 선택</h1>
        <p>감독이 될 국가를 고르세요. 기본 라인업이 전술 보드에 로드됩니다.</p>
      </header>
      <div className="team-grid">
        {teams.map((team) => (
          <button
            key={team.id}
            type="button"
            className="team-card"
            onClick={() => selectTeam(team)}
          >
            <img className="team-flag large" src={`/flags/${team.flag}.svg`} alt={`${team.nameKo} flag`} />
            <span className="team-name">{team.nameKo}</span>
            <span className="team-meta">
              {team.name} · Group {team.group}
            </span>
          </button>
        ))}
      </div>
      <p className="data-note">
        데이터: 큐레이션 샘플 스쿼드 (2022 WC + 2026 예상). 최종 26인 확정 전
        데모용.
      </p>
    </div>
  );
}
