import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { Player, Slot } from "../types";
import { positionFitScore } from "../lib/formation";

type PlayerCardProps = {
  player: Player;
  slot?: Slot;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

export function PlayerCard({
  player,
  slot,
  selected,
  compact,
  onClick,
}: PlayerCardProps) {
  const fit = slot ? positionFitScore(player, slot) : null;
  const fitClass =
    fit === null
      ? ""
      : fit >= 90
        ? "fit-good"
        : fit >= 65
          ? "fit-ok"
          : "fit-bad";

  return (
    <button
      type="button"
      className={`player-card ${compact ? "compact" : ""} ${selected ? "selected" : ""} ${fitClass}`}
      onClick={onClick}
    >
      <span className="player-number">{player.number ?? "—"}</span>
      <span className="player-name">{player.name}</span>
      <span className="player-meta">
        <span className="player-pos">{player.pos}</span>
        <span className="player-ovr">{player.overall}</span>
      </span>
    </button>
  );
}

type DraggablePlayerProps = PlayerCardProps & {
  dragId: string;
};

export function DraggablePlayer({
  dragId,
  player,
  slot,
  selected,
  compact,
  onClick,
}: DraggablePlayerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: dragId, data: { playerId: player.id, type: "player" } });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-wrap ${isDragging ? "dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <PlayerCard
        player={player}
        slot={slot}
        selected={selected}
        compact={compact}
        onClick={onClick}
      />
    </div>
  );
}

type DroppableSlotProps = {
  slot: Slot;
  player?: Player;
  selected?: boolean;
  onPlayerClick?: () => void;
};

export function DroppableSlot({
  slot,
  player,
  selected,
  onPlayerClick,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slot.id}`,
    data: { slotId: slot.id, type: "slot" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`pitch-slot ${isOver ? "drop-over" : ""} ${player ? "filled" : "empty"}`}
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <span className="slot-role">{slot.role}</span>
      {player ? (
        <DraggablePlayer
          dragId={`pitch-${slot.id}`}
          player={player}
          slot={slot}
          selected={selected}
          compact
          onClick={onPlayerClick}
        />
      ) : (
        <div className="slot-placeholder">+</div>
      )}
    </div>
  );
}

type DroppableBenchProps = {
  children: React.ReactNode;
};

export function DroppableBench({ children }: DroppableBenchProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "bench",
    data: { type: "bench" },
  });

  return (
    <div ref={setNodeRef} className={`bench-area ${isOver ? "drop-over" : ""}`}>
      {children}
    </div>
  );
}
