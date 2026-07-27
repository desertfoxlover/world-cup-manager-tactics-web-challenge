import type { Formation, Player, Position, Slot } from "../types";

const POS_ORDER: Position[] = ["GK", "DF", "MF", "FW"];

export function getFormationById(
  formations: Formation[],
  id: string,
): Formation | undefined {
  return formations.find((f) => f.id === id);
}

export function getPlayersByTeam(
  players: Player[],
  teamId: string,
): Player[] {
  return players.filter((p) => p.teamId === teamId);
}

export function buildLineupFromDefault(
  formation: Formation,
  defaultLineup: Record<string, string>,
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const slot of formation.slots) {
    result[slot.id] = defaultLineup[slot.id] ?? null;
  }
  return result;
}

export function autoAssignPlayers(
  formation: Formation,
  players: Player[],
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  const available = [...players].sort(
    (a, b) => b.overall - a.overall,
  );

  for (const slot of formation.slots) {
    result[slot.id] = null;
  }

  for (const pos of POS_ORDER) {
    const slots = formation.slots.filter((s) => s.preferredPos === pos);
    const candidates = available.filter((p) => p.pos === pos);

    for (const slot of slots) {
      const matchIdx = candidates.findIndex((p) =>
        available.some((a) => a.id === p.id),
      );
      if (matchIdx >= 0) {
        const player = candidates.splice(matchIdx, 1)[0];
        result[slot.id] = player.id;
        available.splice(
          available.findIndex((a) => a.id === player.id),
          1,
        );
      }
    }
  }

  for (const slot of formation.slots) {
    if (result[slot.id]) continue;
    if (available.length === 0) break;
    const player = available.shift()!;
    result[slot.id] = player.id;
  }

  return result;
}

export function remapLineupToFormation(
  formation: Formation,
  currentAssignments: Record<string, string | null>,
  allPlayers: Player[],
): Record<string, string | null> {
  const onPitch = Object.values(currentAssignments).filter(
    (id): id is string => !!id,
  );
  const players = onPitch
    .map((id) => allPlayers.find((p) => p.id === id))
    .filter((p): p is Player => !!p);

  return autoAssignPlayers(formation, players);
}

export function getBenchPlayers(
  teamPlayers: Player[],
  assignments: Record<string, string | null>,
): Player[] {
  const onPitch = new Set(
    Object.values(assignments).filter((id): id is string => !!id),
  );
  return teamPlayers
    .filter((p) => !onPitch.has(p.id))
    .sort((a, b) => b.overall - a.overall);
}

export function positionFitScore(
  player: Player,
  slot: Slot,
): number {
  if (player.pos === slot.preferredPos) return 100;
  if (player.pos === "MF" && slot.preferredPos === "DF") return 72;
  if (player.pos === "MF" && slot.preferredPos === "FW") return 75;
  if (player.pos === "DF" && slot.preferredPos === "MF") return 68;
  if (player.pos === "FW" && slot.preferredPos === "MF") return 70;
  if (player.pos === "DF" && slot.preferredPos === "FW") return 45;
  if (player.pos === "FW" && slot.preferredPos === "DF") return 40;
  if (player.pos === "GK" || slot.preferredPos === "GK") {
    return player.pos === "GK" && slot.preferredPos === "GK" ? 100 : 10;
  }
  return 55;
}

export function getPlayerInSlot(
  assignments: Record<string, string | null>,
  slotId: string,
  players: Player[],
): Player | undefined {
  const playerId = assignments[slotId];
  if (!playerId) return undefined;
  return players.find((p) => p.id === playerId);
}
