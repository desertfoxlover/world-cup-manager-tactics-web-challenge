import type { Formation, Player, ScoreComparison, TacticsScore } from "../types";
import { positionFitScore } from "./formation";

function avgOverall(players: Player[]): number {
  if (players.length === 0) return 0;
  return players.reduce((s, p) => s + p.overall, 0) / players.length;
}

function avgPositionFit(
  formation: Formation,
  assignments: Record<string, string | null>,
  playerMap: Map<string, Player>,
): number {
  let total = 0;
  let count = 0;
  for (const slot of formation.slots) {
    const playerId = assignments[slot.id];
    if (!playerId) continue;
    const player = playerMap.get(playerId);
    if (!player) continue;
    total += positionFitScore(player, slot);
    count++;
  }
  return count > 0 ? total / count : 0;
}

function balanceScore(players: Player[]): number {
  const counts = { GK: 0, DF: 0, MF: 0, FW: 0 };
  for (const p of players) counts[p.pos]++;
  const ideal = { GK: 1, DF: 4, MF: 4, FW: 2 };
  let penalty = 0;
  for (const pos of ["GK", "DF", "MF", "FW"] as const) {
    penalty += Math.abs(counts[pos] - ideal[pos]) * 8;
  }
  return Math.max(0, 100 - penalty);
}

export function calculateTacticsScore(
  formation: Formation,
  assignments: Record<string, string | null>,
  players: Player[],
): TacticsScore {
  const playerMap = new Map(players.map((p) => [p.id, p]));
  const starters = formation.slots
    .map((s) => assignments[s.id])
    .filter((id): id is string => !!id)
    .map((id) => playerMap.get(id))
    .filter((p): p is Player => !!p);

  const overall = avgOverall(starters);
  const positionFit = avgPositionFit(formation, assignments, playerMap);
  const balance = balanceScore(starters);
  const total = Math.round(
    overall * 0.45 + positionFit * 0.35 + balance * 0.2,
  );

  return {
    overall: Math.round(overall),
    positionFit: Math.round(positionFit),
    balance: Math.round(balance),
    total,
  };
}

export function compareScores(
  user: TacticsScore,
  original: TacticsScore,
): ScoreComparison {
  return {
    user,
    original,
    delta: user.total - original.total,
  };
}

export function getInsightMessages(
  comparison: ScoreComparison,
  changedCount: number,
): string[] {
  const messages: string[] = [];
  const { delta, user, original } = comparison;

  if (changedCount === 0) {
    messages.push("기본 라인업과 동일합니다. 감독의 손길이 필요해요!");
  } else if (delta > 5) {
    messages.push(`전술 점수가 ${delta}점 상승했습니다. 과감한 선택!`);
  } else if (delta > 0) {
    messages.push(`미세 조정으로 ${delta}점 개선되었습니다.`);
  } else if (delta === 0) {
    messages.push("점수는 같지만 포지션 배치가 달라졌습니다.");
  } else if (delta > -5) {
    messages.push(`약 ${Math.abs(delta)}점 하락 — 포지션 적합성을 확인하세요.`);
  } else {
    messages.push(`전술 리스크 ${Math.abs(delta)}점. 감독의 결단이 필요합니다!`);
  }

  if (user.positionFit > original.positionFit + 3) {
    messages.push("포지션 적합성이 크게 개선되었습니다.");
  } else if (user.positionFit < original.positionFit - 3) {
    messages.push("일부 선수가 낯선 포지션에 배치되어 있습니다.");
  }

  if (user.balance > original.balance + 2) {
    messages.push("수비·미드·공격 밸런스가 더 안정적입니다.");
  }

  return messages;
}
