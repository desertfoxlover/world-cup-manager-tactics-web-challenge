export type Position = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  teamId: string;
  pos: Position;
  number?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  defending?: number;
  physical?: number;
  overall: number;
};

export type Team = {
  id: string;
  name: string;
  nameKo: string;
  group: string;
  flag: string;
  defaultFormationId: string;
  defaultLineup: Record<string, string>;
};

export type Slot = {
  id: string;
  role: string;
  preferredPos: Position;
  x: number;
  y: number;
};

export type Formation = {
  id: string;
  name: string;
  slots: Slot[];
};

export type Screen = "landing" | "select" | "board" | "result";

export type TacticsScore = {
  overall: number;
  positionFit: number;
  balance: number;
  total: number;
};

export type ScoreComparison = {
  user: TacticsScore;
  original: TacticsScore;
  delta: number;
};
