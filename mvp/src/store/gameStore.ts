import { create } from "zustand";
import type {
  Formation,
  Player,
  ScoreComparison,
  Screen,
  Team,
  TacticsScore,
} from "../types";
import {
  buildLineupFromDefault,
  getBenchPlayers,
  getFormationById,
  getPlayersByTeam,
  remapLineupToFormation,
} from "../lib/formation";
import { calculateTacticsScore, compareScores } from "../lib/score";

type GameState = {
  screen: Screen;
  teams: Team[];
  players: Player[];
  formations: Formation[];
  selectedTeam: Team | null;
  formationId: string;
  assignments: Record<string, string | null>;
  originalAssignments: Record<string, string | null>;
  selectedPlayerId: string | null;
  userScore: TacticsScore | null;
  originalScore: TacticsScore | null;
  comparison: ScoreComparison | null;
  dataLoaded: boolean;

  initData: (
    teams: Team[],
    players: Player[],
    formations: Formation[],
  ) => void;
  setScreen: (screen: Screen) => void;
  selectTeam: (team: Team) => void;
  setFormation: (formationId: string) => void;
  assignPlayerToSlot: (slotId: string, playerId: string | null) => void;
  swapSlotPlayers: (fromSlotId: string, toSlotId: string) => void;
  selectPlayer: (playerId: string | null) => void;
  resetLineup: () => void;
  confirmTactics: () => void;
  backToBoard: () => void;
};

function recalcScores(
  get: () => GameState,
  set: (partial: Partial<GameState>) => void,
) {
  const state = get();
  if (!state.selectedTeam) return;
  const formation = getFormationById(state.formations, state.formationId);
  if (!formation) return;
  const teamPlayers = getPlayersByTeam(state.players, state.selectedTeam.id);

  const userScore = calculateTacticsScore(
    formation,
    state.assignments,
    teamPlayers,
  );
  const originalScore = calculateTacticsScore(
    formation,
    state.originalAssignments,
    teamPlayers,
  );
  set({
    userScore,
    originalScore,
    comparison: compareScores(userScore, originalScore),
  });
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "landing",
  teams: [],
  players: [],
  formations: [],
  selectedTeam: null,
  formationId: "4-3-3",
  assignments: {},
  originalAssignments: {},
  selectedPlayerId: null,
  userScore: null,
  originalScore: null,
  comparison: null,
  dataLoaded: false,

  initData: (teams, players, formations) => {
    set({ teams, players, formations, dataLoaded: true });
  },

  setScreen: (screen) => set({ screen }),

  selectTeam: (team) => {
    const { formations } = get();
    const formation = getFormationById(formations, team.defaultFormationId);
    if (!formation) return;

    const assignments = buildLineupFromDefault(formation, team.defaultLineup);
    const originalAssignments = { ...assignments };

    set({
      selectedTeam: team,
      formationId: team.defaultFormationId,
      assignments,
      originalAssignments,
      selectedPlayerId: null,
      screen: "board",
    });
    recalcScores(get, set);
  },

  setFormation: (formationId) => {
    const { formations, assignments, players, selectedTeam } = get();
    if (!selectedTeam) return;
    const formation = getFormationById(formations, formationId);
    if (!formation) return;

    const teamPlayers = getPlayersByTeam(players, selectedTeam.id);
    const newAssignments = remapLineupToFormation(
      formation,
      assignments,
      teamPlayers,
    );

    set({ formationId, assignments: newAssignments, selectedPlayerId: null });
    recalcScores(get, set);
  },

  assignPlayerToSlot: (slotId, playerId) => {
    const { assignments, formations, formationId } = get();
    const formation = getFormationById(formations, formationId);
    if (!formation) return;

    const slot = formation.slots.find((s) => s.id === slotId);
    if (!slot) return;

    const next = { ...assignments };

    if (playerId) {
      const existingSlot = formation.slots.find(
        (s) => next[s.id] === playerId,
      );
      const currentInTarget = next[slotId];

      if (existingSlot && existingSlot.id !== slotId) {
        next[existingSlot.id] = currentInTarget;
      } else if (existingSlot?.id === slotId) {
        return;
      }

      next[slotId] = playerId;
    } else {
      next[slotId] = null;
    }

    set({ assignments: next, selectedPlayerId: playerId });
    recalcScores(get, set);
  },

  swapSlotPlayers: (fromSlotId, toSlotId) => {
    const { assignments } = get();
    const next = { ...assignments };
    const temp = next[fromSlotId];
    next[fromSlotId] = next[toSlotId] ?? null;
    next[toSlotId] = temp ?? null;
    set({ assignments: next });
    recalcScores(get, set);
  },

  selectPlayer: (playerId) => set({ selectedPlayerId: playerId }),

  resetLineup: () => {
    const { originalAssignments } = get();
    set({
      assignments: { ...originalAssignments },
      selectedPlayerId: null,
    });
    recalcScores(get, set);
  },

  confirmTactics: () => {
    recalcScores(get, set);
    set({ screen: "result" });
  },

  backToBoard: () => set({ screen: "board" }),
}));

export function useBenchPlayers() {
  const selectedTeam = useGameStore((s) => s.selectedTeam);
  const players = useGameStore((s) => s.players);
  const assignments = useGameStore((s) => s.assignments);
  if (!selectedTeam) return [];
  return getBenchPlayers(
    getPlayersByTeam(players, selectedTeam.id),
    assignments,
  );
}

export function useCurrentFormation() {
  const formations = useGameStore((s) => s.formations);
  const formationId = useGameStore((s) => s.formationId);
  return getFormationById(formations, formationId);
}

export function countLineupChanges(
  assignments: Record<string, string | null>,
  original: Record<string, string | null>,
): number {
  const slots = new Set([...Object.keys(assignments), ...Object.keys(original)]);
  let changes = 0;
  for (const slot of slots) {
    if (assignments[slot] !== original[slot]) changes++;
  }
  return changes;
}
