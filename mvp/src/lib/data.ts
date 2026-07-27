import type { Formation, Player, Team } from "../types";

export async function loadTeams(): Promise<Team[]> {
  const res = await fetch("/data/teams.json");
  if (!res.ok) throw new Error("Failed to load teams");
  return res.json();
}

export async function loadPlayers(): Promise<Player[]> {
  const res = await fetch("/data/players.json");
  if (!res.ok) throw new Error("Failed to load players");
  return res.json();
}

export async function loadFormations(): Promise<Formation[]> {
  const res = await fetch("/data/formations.json");
  if (!res.ok) throw new Error("Failed to load formations");
  return res.json();
}

export async function loadAllData() {
  const [teams, players, formations] = await Promise.all([
    loadTeams(),
    loadPlayers(),
    loadFormations(),
  ]);
  return { teams, players, formations };
}
