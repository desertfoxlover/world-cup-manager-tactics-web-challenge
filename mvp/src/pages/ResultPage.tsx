import {
  countLineupChanges,
  useCurrentFormation,
  useGameStore,
} from "../store/gameStore";
import { getInsightMessages } from "../lib/score";
import { getPlayerInSlot } from "../lib/formation";

export function ResultPage() {
  const selectedTeam = useGameStore((s) => s.selectedTeam);
  const formation = useCurrentFormation();
  const assignments = useGameStore((s) => s.assignments);
  const originalAssignments = useGameStore((s) => s.originalAssignments);
  const players = useGameStore((s) => s.players);
  const comparison = useGameStore((s) => s.comparison);
  const userScore = useGameStore((s) => s.userScore);
  const originalScore = useGameStore((s) => s.originalScore);
  const backToBoard = useGameStore((s) => s.backToBoard);
  const setScreen = useGameStore((s) => s.setScreen);

  if (!selectedTeam || !formation || !userScore || !originalScore || !comparison) {
    return null;
  }

  const changes = countLineupChanges(assignments, originalAssignments);
  const messages = getInsightMessages(comparison, changes);

  return (
    <div className="result-page">
      <div className="result-card">
        <header className="result-header">
          <img className="team-flag large" src={`/flags/${selectedTeam.flag}.svg`} alt={`${selectedTeam.nameKo} flag`} />
          <div>
            <p className="result-label">내가 감독이었다면</p>
            <h1>{selectedTeam.nameKo}</h1>
            <p className="result-formation">{formation.name} · 변경 {changes}곳</p>
          </div>
        </header>

        <div className="result-scores">
          <div className="result-score-box user">
            <span className="label">내 전술</span>
            <span className="value">{userScore.total}</span>
          </div>
          <div className="result-vs">vs</div>
          <div className="result-score-box original">
            <span className="label">기본 라인업</span>
            <span className="value">{originalScore.total}</span>
          </div>
          <div className={`result-delta ${comparison.delta >= 0 ? "up" : "down"}`}>
            {comparison.delta >= 0 ? "+" : ""}
            {comparison.delta}
          </div>
        </div>

        <div className="result-lineup">
          <h3>선발 라인업</h3>
          <ul>
            {formation.slots.map((slot) => {
              const player = getPlayerInSlot(assignments, slot.id, players);
              const wasOriginal =
                originalAssignments[slot.id] === player?.id;
              return (
                <li key={slot.id} className={wasOriginal ? "" : "changed"}>
                  <span className="slot">{slot.role}</span>
                  <span className="name">{player?.name ?? "—"}</span>
                  {!wasOriginal && player && (
                    <span className="badge">변경</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="result-insights">
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>

        <div className="result-actions">
          <button type="button" className="btn ghost" onClick={backToBoard}>
            전술 수정
          </button>
          <button type="button" className="btn primary" onClick={() => setScreen("select")}>
            다른 팀 선택
          </button>
        </div>
      </div>
    </div>
  );
}
