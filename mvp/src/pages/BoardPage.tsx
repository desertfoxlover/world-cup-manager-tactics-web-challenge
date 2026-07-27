import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import type { Player } from "../types";
import { getPlayerInSlot } from "../lib/formation";
import {
  useCurrentFormation,
  useGameStore,
} from "../store/gameStore";
import { Bench } from "../components/Bench";
import { FormationSelector } from "../components/FormationSelector";
import { InsightPanel } from "../components/InsightPanel";
import { DragOverlayCard, PitchBoard } from "../components/PitchBoard";

export function BoardPage() {
  const selectedTeam = useGameStore((s) => s.selectedTeam);
  const formation = useCurrentFormation();
  const assignments = useGameStore((s) => s.assignments);
  const players = useGameStore((s) => s.players);
  const assignPlayerToSlot = useGameStore((s) => s.assignPlayerToSlot);
  const swapSlotPlayers = useGameStore((s) => s.swapSlotPlayers);
  const resetLineup = useGameStore((s) => s.resetLineup);
  const confirmTactics = useGameStore((s) => s.confirmTactics);
  const setScreen = useGameStore((s) => s.setScreen);

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  );

  if (!selectedTeam || !formation) return null;

  const handleDragStart = (event: DragStartEvent) => {
    const playerId = event.active.data.current?.playerId as string | undefined;
    if (playerId) {
      const player = players.find((p) => p.id === playerId);
      setActivePlayer(player ?? null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    const playerId = event.active.data.current?.playerId as string | undefined;
    if (!playerId || !event.over) return;

    const overData = event.over.data.current;
    if (!overData) return;

    if (overData.type === "slot") {
      const slotId = overData.slotId as string;
      const targetPlayer = getPlayerInSlot(assignments, slotId, players);
      const sourceSlot = formation.slots.find(
        (s) => assignments[s.id] === playerId,
      );

      if (targetPlayer && sourceSlot) {
        swapSlotPlayers(sourceSlot.id, slotId);
      } else {
        assignPlayerToSlot(slotId, playerId);
      }
    } else if (overData.type === "bench") {
      const sourceSlot = formation.slots.find(
        (s) => assignments[s.id] === playerId,
      );
      if (sourceSlot) {
        assignPlayerToSlot(sourceSlot.id, null);
      }
    }
  };

  return (
    <div className="board-page">
      <header className="board-header">
        <button type="button" className="btn ghost" onClick={() => setScreen("select")}>
          ← 팀 선택
        </button>
        <div className="board-title">
          <img className="team-flag" src={`/flags/${selectedTeam.flag}.svg`} alt={`${selectedTeam.nameKo} flag`} />
          <h1>{selectedTeam.nameKo}</h1>
        </div>
        <div className="board-actions">
          <button type="button" className="btn ghost" onClick={resetLineup}>
            초기화
          </button>
          <button type="button" className="btn primary" onClick={confirmTactics}>
            전술 확정
          </button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board-layout">
          <aside className="board-sidebar left">
            <FormationSelector />
            <Bench />
          </aside>
          <main className="board-main">
            <PitchBoard />
          </main>
          <aside className="board-sidebar right">
            <InsightPanel />
          </aside>
        </div>
        <DragOverlay>
          {activePlayer ? <DragOverlayCard player={activePlayer} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
