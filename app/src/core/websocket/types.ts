import type { Player, ErrorCode } from "@tour-de-mot/shared/types";

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
