import type { Player, ErrorCode } from "@ws-poc/shared/types";

export type GameState = {
  code: string;
  players: Player[];
  error: ErrorCode | null;
};

export const initialGameState: GameState = {
  code: "",
  players: [],
  error: null,
};
