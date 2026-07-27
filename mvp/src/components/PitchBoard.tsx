import type { Player } from "../types";
import { getPlayerInSlot } from "../lib/formation";
import {
  useCurrentFormation,
  useGameStore,
} from "../store/gameStore";
import { DroppableSlot } from "./PlayerCard";

export function PitchBoard() {
  const formation = useCurrentFormation();
  const assignments = useGameStore((s) => s.assignments);
  const players = useGameStore((s) => s.players);
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const selectPlayer = useGameStore((s) => s.selectPlayer);

  if (!formation) return null;

  return (
    <div className="pitch-board">
      <div className="pitch-grass">
        <div className="pitch-line center-line" />
        <div className="pitch-circle" />
        <div className="pitch-box top" />
        <div className="pitch-box bottom" />
        {formation.slots.map((slot) => {
          const player = getPlayerInSlot(assignments, slot.id, players);
          return (
            <DroppableSlot
              key={slot.id}
              slot={slot}
              player={player}
              selected={player?.id === selectedPlayerId}
              onPlayerClick={() =>
                selectPlayer(
                  player?.id === selectedPlayerId ? null : (player?.id ?? null),
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export function DragOverlayCard({ player }: { player: Player }) {
  return (
    <div className="player-card compact dragging-overlay">
      <span className="player-number">{player.number ?? "—"}</span>
      <span className="player-name">{player.name}</span>
    </div>
  );
}
