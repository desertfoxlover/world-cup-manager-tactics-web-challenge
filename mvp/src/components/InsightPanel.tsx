import { positionFitScore } from "../lib/formation";
import { getInsightMessages } from "../lib/score";
import {
  countLineupChanges,
  useCurrentFormation,
  useGameStore,
} from "../store/gameStore";

export function InsightPanel() {
  const formation = useCurrentFormation();
  const players = useGameStore((s) => s.players);
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const assignments = useGameStore((s) => s.assignments);
  const originalAssignments = useGameStore((s) => s.originalAssignments);
  const comparison = useGameStore((s) => s.comparison);
  const userScore = useGameStore((s) => s.userScore);
  const originalScore = useGameStore((s) => s.originalScore);

  const selectedPlayer = selectedPlayerId
    ? players.find((p) => p.id === selectedPlayerId)
    : null;

  const selectedSlot = selectedPlayer
    ? formation?.slots.find((s) => assignments[s.id] === selectedPlayer.id)
    : null;

  const fit =
    selectedPlayer && selectedSlot
      ? positionFitScore(selectedPlayer, selectedSlot)
      : null;

  const changes = countLineupChanges(assignments, originalAssignments);
  const messages =
    comparison && userScore && originalScore
      ? getInsightMessages(comparison, changes)
      : [];

  return (
    <div className="insight-panel">
      <h3 className="panel-title">전술 인사이트</h3>

      {userScore && (
        <div className="score-block">
          <div className="score-main">
            <span className="score-label">전술 점수</span>
            <span className="score-value">{userScore.total}</span>
            {comparison && (
              <span
                className={`score-delta ${comparison.delta >= 0 ? "up" : "down"}`}
              >
                {comparison.delta >= 0 ? "+" : ""}
                {comparison.delta}
              </span>
            )}
          </div>
          <div className="score-bars">
            <ScoreBar label="종합" value={userScore.overall} />
            <ScoreBar label="포지션 적합" value={userScore.positionFit} />
            <ScoreBar label="밸런스" value={userScore.balance} />
          </div>
          {originalScore && (
            <p className="score-compare">
              기본 라인업: {originalScore.total}점 · 변경 {changes}곳
            </p>
          )}
        </div>
      )}

      {selectedPlayer ? (
        <div className="player-detail">
          <h4>{selectedPlayer.name}</h4>
          <p className="player-detail-pos">
            {selectedPlayer.pos} · OVR {selectedPlayer.overall}
            {selectedSlot && fit !== null && (
              <span className={`fit-badge ${fit >= 90 ? "good" : fit >= 65 ? "ok" : "bad"}`}>
                적합 {fit}%
              </span>
            )}
          </p>
          <div className="stat-grid">
            <StatItem label="PAC" value={selectedPlayer.pace} />
            <StatItem label="SHO" value={selectedPlayer.shooting} />
            <StatItem label="PAS" value={selectedPlayer.passing} />
            <StatItem label="DEF" value={selectedPlayer.defending} />
            <StatItem label="PHY" value={selectedPlayer.physical} />
          </div>
        </div>
      ) : (
        <p className="insight-hint">
          선수를 클릭하거나 드래그해 배치하세요. 벤치에서 필드로 끌어 교체할 수
          있습니다.
        </p>
      )}

      {messages.length > 0 && (
        <ul className="insight-messages">
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="score-bar-num">{value}</span>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value?: number }) {
  return (
    <div className="stat-item">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}
