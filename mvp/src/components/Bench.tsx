import { useBenchPlayers, useGameStore } from "../store/gameStore";
import { DraggablePlayer, DroppableBench } from "./PlayerCard";

export function Bench() {
  const benchPlayers = useBenchPlayers();
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const selectPlayer = useGameStore((s) => s.selectPlayer);

  return (
    <div className="bench-panel">
      <h3 className="panel-title">벤치</h3>
      <DroppableBench>
        <div className="bench-grid">
          {benchPlayers.map((player) => (
            <DraggablePlayer
              key={player.id}
              dragId={`bench-${player.id}`}
              player={player}
              selected={player.id === selectedPlayerId}
              compact
              onClick={() =>
                selectPlayer(
                  player.id === selectedPlayerId ? null : player.id,
                )
              }
            />
          ))}
        </div>
        {benchPlayers.length === 0 && (
          <p className="bench-empty">모든 선수가 필드에 있습니다</p>
        )}
      </DroppableBench>
    </div>
  );
}
